.PHONY: build

build:
	@echo "Removendo pasta dist (se existir)..."
	rm -rf dist
	@echo "Compilando o projeto com tsc..."
	npm run build
	@echo "Build finalizado."
