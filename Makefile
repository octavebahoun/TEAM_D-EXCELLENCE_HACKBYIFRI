# ================================================================
# AcademiX - Makefile (VPS Ubuntu 4Go RAM)
# ================================================================

.PHONY: help setup start stop restart logs status build clean db-migrate db-seed shell-laravel shell-node shell-python

# Couleurs
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
RESET  := \033[0m

help: ## Afficher cette aide
	@echo "$(GREEN)AcademiX - Commandes de déploiement$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(RESET) %s\n", $$1, $$2}'

setup: ## Premier setup (copier .env, builder les images)
	@echo "$(GREEN)[1/3] Copie du fichier .env...$(RESET)"
	@test -f .env || cp docker/.env.docker .env && echo "Fichier .env créé. $(YELLOW)Éditez-le avec vos vraies clés !$(RESET)"
	@echo "$(GREEN)[2/3] Construction des images Docker...$(RESET)"
	@docker compose build --parallel
	@echo "$(GREEN)[3/3] Installation des dépendances Laravel...$(RESET)"
	@docker compose run --rm laravel composer install --no-dev
	@docker compose run --rm laravel php artisan key:generate
	@docker compose run --rm laravel php artisan migrate --seed
	@echo "$(GREEN)✅ Setup terminé ! Éditez .env puis lancez 'make start'$(RESET)"

start: ## Démarrer tous les services
	@echo "$(GREEN)Démarrage d'AcademiX...$(RESET)"
	@docker compose up -d
	@echo "$(GREEN)✅ Services démarrés :$(RESET)"
	@echo "   Laravel  → http://localhost:$(LARAVEL_PORT:-8000)"
	@echo "   Node.js  → http://localhost:$(NODE_PORT:-3001)"
	@echo "   Python   → http://localhost:$(PYTHON_PORT:-5000)"

stop: ## Arrêter tous les services
	@docker compose down

restart: ## Redémarrer tous les services
	@docker compose down && docker compose up -d

logs: ## Voir les logs (tous les services)
	@docker compose logs -f

logs-laravel: ## Voir les logs Laravel
	@docker compose logs -f laravel

logs-node: ## Voir les logs Node.js
	@docker compose logs -f node

logs-python: ## Voir les logs Python
	@docker compose logs -f python

status: ## Statut de tous les services
	@docker compose ps

build: ## Reconstruire les images
	@docker compose build --parallel

clean: ## Supprimer les containers et volumes (⚠️ DANGER)
	@echo "$(RED)⚠️  Ceci supprimera TOUTES les données !$(RESET)"
	@read -p "Confirmer ? (y/N) " confirm && [ "$$confirm" = "y" ] && docker compose down -v --rmi all

db-migrate: ## Lancer les migrations Laravel
	@docker compose run --rm laravel php artisan migrate --force

db-seed: ## Lancer les seeders
	@docker compose run --rm laravel php artisan db:seed

db-fresh: ## Reset complet de la base (⚠️ DANGER)
	@docker compose run --rm laravel php artisan migrate:fresh --seed

shell-laravel: ## Shell dans le container Laravel
	@docker compose exec laravel sh

shell-node: ## Shell dans le container Node.js
	@docker compose exec node sh

shell-python: ## Shell dans le container Python
	@docker compose exec python bash

# Allocation mémoire pour VPS 4Go
stats: ## Voir l'utilisation mémoire des containers
	@docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.CPUPerc}}"
