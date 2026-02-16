#!/bin/bash

# ============================================
# 🗄️ MIGRATIONS MYSQL (Laravel) - 13 TABLES
# ============================================
# Données structurées et relationnelles

set -e

echo "🐬 Création des migrations MySQL (Laravel)..."
echo ""

cd backend/laravel

# ============================================
# 1. USERS
# ============================================
echo "📝 Création migration: users..."
cat > database/migrations/2024_01_01_000001_create_users_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('nom', 100);
            $table->string('prenom', 100);
            $table->string('universite')->nullable();
            $table->string('filiere')->nullable();
            $table->enum('niveau', ['L1', 'L2', 'L3', 'M1', 'M2', 'Doctorat'])->nullable();
            $table->decimal('objectif_moyenne', 4, 2)->nullable();
            $table->enum('style_apprentissage', ['visuel', 'auditif', 'kinesthésique'])->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->integer('xp_total')->default(0);
            $table->integer('niveau_gamification')->default(1);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
EOF

# ============================================
# 2. MATIERES
# ============================================
echo "📝 Création migration: matieres..."
cat > database/migrations/2024_01_01_000002_create_matieres_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matieres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->decimal('coefficient', 3, 1)->default(1.0);
            $table->string('couleur', 7)->default('#3B82F6');
            $table->integer('niveau_maitrise')->default(3); // 1-5
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matieres');
    }
};
EOF

# ============================================
# 3. EMPLOI DU TEMPS
# ============================================
echo "📝 Création migration: emploi_temps..."
cat > database/migrations/2024_01_01_000003_create_emploi_temps_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('emploi_temps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('matiere_id')->constrained()->onDelete('cascade');
            $table->enum('jour_semaine', ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']);
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->string('salle')->nullable();
            $table->string('professeur')->nullable();
            $table->enum('type_cours', ['CM', 'TD', 'TP', 'Autre'])->default('CM');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('emploi_temps');
    }
};
EOF

# ============================================
# 4. TÂCHES
# ============================================
echo "📝 Création migration: taches..."
cat > database/migrations/2024_01_01_000004_create_taches_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('taches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained()->onDelete('set null');
            $table->string('titre');
            $table->text('description')->nullable();
            $table->enum('type', ['devoir', 'revision', 'examen', 'projet', 'lecture', 'autre'])->default('devoir');
            $table->dateTime('date_limite')->nullable();
            $table->enum('priorite', ['basse', 'moyenne', 'haute'])->default('moyenne');
            $table->enum('statut', ['a_faire', 'en_cours', 'termine'])->default('a_faire');
            $table->integer('temps_estime')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taches');
    }
};
EOF

# ============================================
# 5. NOTES
# ============================================
echo "📝 Création migration: notes..."
cat > database/migrations/2024_01_01_000005_create_notes_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->constrained()->onDelete('cascade');
            $table->string('intitule');
            $table->decimal('note_obtenue', 5, 2);
            $table->decimal('note_maximale', 5, 2)->default(20.00);
            $table->decimal('coefficient', 3, 1)->default(1.0);
            $table->date('date_evaluation');
            $table->enum('type_evaluation', ['devoir', 'controle', 'partiel', 'examen', 'projet'])->default('devoir');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
EOF

# ============================================
# 6. ALERTES
# ============================================
echo "📝 Création migration: alertes..."
cat > database/migrations/2024_01_01_000006_create_alertes_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alertes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained()->onDelete('cascade');
            $table->enum('type_alerte', ['risque_echec', 'moyenne_basse', 'retard_devoirs', 'absence_revision']);
            $table->enum('niveau_severite', ['info', 'warning', 'danger'])->default('warning');
            $table->string('titre');
            $table->text('message');
            $table->json('actions_suggerees')->nullable();
            $table->boolean('is_read')->default(false);
            $table->boolean('is_dismissed')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alertes');
    }
};
EOF

# ============================================
# 7. RESSOURCES PARTAGÉES
# ============================================
echo "📝 Création migration: ressources_partagees..."
cat > database/migrations/2024_01_01_000007_create_ressources_partagees_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ressources_partagees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type_ressource', ['fiche', 'epreuve', 'resume', 'mindmap', 'autre']);
            $table->string('titre');
            $table->text('description')->nullable();
            $table->string('fichier_url');
            $table->json('tags')->nullable();
            $table->decimal('note_moyenne', 2, 1)->default(0.0);
            $table->integer('nb_telechargements')->default(0);
            $table->integer('nb_votes')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ressources_partagees');
    }
};
EOF

# ============================================
# 8. CONTENUS IA
# ============================================
echo "📝 Création migration: contenus_ia..."
cat > database/migrations/2024_01_01_000008_create_contenus_ia_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contenus_ia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('matiere_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type_contenu', ['fiche', 'quiz', 'podcast', 'exercices']);
            $table->string('titre');
            $table->longText('contenu_json');
            $table->string('source_doc')->nullable();
            $table->string('fichier_genere')->nullable();
            $table->enum('statut', ['en_cours', 'termine', 'erreur'])->default('en_cours');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contenus_ia');
    }
};
EOF

# ============================================
# 9. QUIZ QUESTIONS
# ============================================
echo "📝 Création migration: quiz_questions..."
cat > database/migrations/2024_01_01_000009_create_quiz_questions_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contenu_ia_id')->constrained()->onDelete('cascade');
            $table->text('question');
            $table->json('options');
            $table->integer('reponse_correcte');
            $table->text('explication')->nullable();
            $table->integer('ordre')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
EOF

# ============================================
# 10. QUIZ RÉSULTATS
# ============================================
echo "📝 Création migration: quiz_resultats..."
cat > database/migrations/2024_01_01_000010_create_quiz_resultats_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_resultats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('contenu_ia_id')->constrained()->onDelete('cascade');
            $table->integer('score');
            $table->integer('score_max');
            $table->integer('temps_passe')->nullable();
            $table->json('reponses_donnees')->nullable();
            $table->json('notions_faibles')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_resultats');
    }
};
EOF

# ============================================
# 11. BADGES
# ============================================
echo "📝 Création migration: badges..."
cat > database/migrations/2024_01_01_000011_create_badges_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('nom');
            $table->text('description');
            $table->string('icone')->nullable();
            $table->json('condition_json')->nullable();
            $table->integer('xp_bonus')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};
EOF

# ============================================
# 12. USER BADGES
# ============================================
echo "📝 Création migration: user_badges..."
cat > database/migrations/2024_01_01_000012_create_user_badges_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('badge_id')->constrained()->onDelete('cascade');
            $table->timestamp('obtenu_le');
            $table->timestamps();
            
            $table->unique(['user_id', 'badge_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_badges');
    }
};
EOF


echo "📝 Création migration: statistiques..."
cat > database/migrations/2024_01_01_000013_create_statistiques_table.php << 'EOF'
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('statistiques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->integer('temps_etude_minutes')->default(0);
            $table->integer('nb_taches_completees')->default(0);
            $table->integer('nb_quiz_faits')->default(0);
            $table->integer('nb_sessions_participees')->default(0);
            $table->decimal('moyenne_generale', 5, 2)->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('statistiques');
    }
};
EOF

echo ""
echo "✅ 13 migrations MySQL créées!"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Créer la DB: CREATE DATABASE academix;"
echo "   2. Lancer: php artisan migrate"
echo ""
