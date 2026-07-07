<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use App\Models\ReservationSalle;
use App\Models\EmploiTempsFiliere;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class SalleController extends Controller
{
    private const JOURS = [
        0 => 'Dimanche', 1 => 'Lundi', 2 => 'Mardi', 3 => 'Mercredi',
        4 => 'Jeudi', 5 => 'Vendredi', 6 => 'Samedi',
    ];

    public function index(Request $request)
    {
        $salles = Salle::when($request->search, function ($q, $search) {
                $q->where('nom', 'like', "%{$search}%")->orWhere('localisation', 'like', "%{$search}%");
            })
            ->when($request->type, fn($q, $v) => $q->where('type', $v))
            ->when($request->has('is_active'), fn($q) => $q->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN)))
            ->orderBy('nom')
            ->get();

        return response()->json($salles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'          => 'required|string|max:50|unique:salles,nom',
            'capacite'     => 'nullable|integer|min:1',
            'type'         => 'nullable|in:amphi,salle_td,labo,salle_info,autre',
            'localisation' => 'nullable|string|max:150',
            'is_active'    => 'sometimes|boolean',
        ]);

        $salle = Salle::create($validated);
        AuditLog::record($request->user(), 'salle.creee', "Salle {$salle->nom} créée", [], $salle);

        return response()->json($salle, 201);
    }

    public function show($id)
    {
        $salle = Salle::with(['reservations' => function ($q) {
            $q->whereDate('date_reservation', '>=', now()->toDateString())->orderBy('date_reservation');
        }])->findOrFail($id);

        return response()->json($salle);
    }

    public function update(Request $request, $id)
    {
        $salle = Salle::findOrFail($id);

        $validated = $request->validate([
            'nom'          => ['sometimes', 'string', 'max:50', Rule::unique('salles', 'nom')->ignore($id)],
            'capacite'     => 'nullable|integer|min:1',
            'type'         => 'nullable|in:amphi,salle_td,labo,salle_info,autre',
            'localisation' => 'nullable|string|max:150',
            'is_active'    => 'sometimes|boolean',
        ]);

        $salle->update($validated);
        AuditLog::record($request->user(), 'salle.modifiee', "Salle #{$salle->id} modifiée", $validated, $salle);

        return response()->json($salle);
    }

    public function destroy(Request $request, $id)
    {
        $salle = Salle::findOrFail($id);
        $salle->delete();
        AuditLog::record($request->user(), 'salle.supprimee', "Salle #{$id} supprimée", [], null);

        return response()->noContent();
    }

    /**
     * Disponibilité des salles pour un créneau donné.
     * Params: date (Y-m-d), heure_debut (H:i), heure_fin (H:i), [semestre].
     * Occupation = cours récurrents (emploi du temps, même jour de semaine) + réservations ponctuelles (même date).
     */
    public function disponibilite(Request $request)
    {
        $validated = $request->validate([
            'date'        => 'required|date',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin'   => 'required|date_format:H:i|after:heure_debut',
            'semestre'    => 'nullable|in:S1,S2',
        ]);

        $jour = self::JOURS[Carbon::parse($validated['date'])->dayOfWeek];

        $salles = Salle::where('is_active', true)->orderBy('nom')->get();

        $coursOccupes = EmploiTempsFiliere::where('jour', $jour)
            ->when($validated['semestre'] ?? null, fn($q, $v) => $q->where('semestre', $v))
            ->where('heure_debut', '<', $validated['heure_fin'])
            ->where('heure_fin', '>', $validated['heure_debut'])
            ->pluck('salle')
            ->filter()
            ->map(fn($s) => mb_strtolower(trim($s)))
            ->unique();

        $reservationsOccupees = ReservationSalle::whereDate('date_reservation', $validated['date'])
            ->where('heure_debut', '<', $validated['heure_fin'])
            ->where('heure_fin', '>', $validated['heure_debut'])
            ->pluck('salle_id')
            ->unique();

        $result = $salles->map(function ($salle) use ($coursOccupes, $reservationsOccupees) {
            $occupeParCours = $coursOccupes->contains(mb_strtolower(trim($salle->nom)));
            $occupeParResa = $reservationsOccupees->contains($salle->id);

            return [
                'id'               => $salle->id,
                'nom'              => $salle->nom,
                'capacite'         => $salle->capacite,
                'type'             => $salle->type,
                'disponible'       => !($occupeParCours || $occupeParResa),
                'motif_occupation' => $occupeParCours ? 'cours' : ($occupeParResa ? 'reservation' : null),
            ];
        });

        return response()->json([
            'date'    => $validated['date'],
            'jour'    => $jour,
            'creneau' => $validated['heure_debut'] . ' - ' . $validated['heure_fin'],
            'salles'  => $result,
        ]);
    }

    /** Réserver une salle pour un créneau ponctuel (réunion, rattrapage, etc.). */
    public function reserver(Request $request, $id)
    {
        $salle = Salle::findOrFail($id);
        $admin = $request->user();

        $validated = $request->validate([
            'date_reservation' => 'required|date',
            'heure_debut'      => 'required|date_format:H:i',
            'heure_fin'        => 'required|date_format:H:i|after:heure_debut',
            'motif'            => 'nullable|string|max:200',
        ]);

        $conflit = ReservationSalle::where('salle_id', $salle->id)
            ->whereDate('date_reservation', $validated['date_reservation'])
            ->where('heure_debut', '<', $validated['heure_fin'])
            ->where('heure_fin', '>', $validated['heure_debut'])
            ->exists();

        if ($conflit) {
            return response()->json(['message' => 'Cette salle est déjà réservée sur ce créneau.'], 409);
        }

        $reservation = ReservationSalle::create([
            'salle_id'            => $salle->id,
            'date_reservation'    => $validated['date_reservation'],
            'heure_debut'         => $validated['heure_debut'],
            'heure_fin'           => $validated['heure_fin'],
            'motif'               => $validated['motif'] ?? null,
            'created_by_admin_id' => $admin->id,
        ]);

        AuditLog::record($admin, 'salle.reservee', "Salle {$salle->nom} réservée le {$validated['date_reservation']}", $validated, $reservation);

        return response()->json($reservation->load('salle:id,nom'), 201);
    }

    public function annulerReservation(Request $request, $reservationId)
    {
        $reservation = ReservationSalle::findOrFail($reservationId);
        $reservation->delete();
        AuditLog::record($request->user(), 'salle.reservation_annulee', "Réservation #{$reservationId} annulée", [], null);

        return response()->noContent();
    }
}
