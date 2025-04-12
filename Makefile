.PHONY: build

build:
	@echo "Removendo pasta dist (se existir)..."
	rm -rf dist
	@echo "Compilando o projeto com tsc..."
	npm run build
	@echo "Movendo arquivos de dist/src para dist..."
	mv dist/src/* dist/ && rm -rf dist/src
	@echo "Build finalizado."
