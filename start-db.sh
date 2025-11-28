PORT=8000

check_port(){
    if lsof -i :$PORT >/dev/null 2>&1; then
        echo "✅ DynamoDB Local já está rodando na porta: $PORT"
        return 0
    else
        return 1
    fi
}

start_dynamodb(){
    echo "🚀 Iniciando o DynamoDB Local..."
    docker run -p $PORT:8000 amazon/dynamodb-local
}

main(){
    if ! command -v docker &> /dev/null
    then
        echo "❌ Docker não foi encontrador. Instale o Docker antes de continuar."
        exit 1
    fi

    if ! check_port; then
        start_dynamodb
        echo "⏳ Aguardando o DynamoDB iniciar..."
        sleep 5
    fi


    if [ -f ./infra/create-tables.js ]; then
        echo "⏳ Criando tabelas no DynamoDB local..."
        node ./infra/create-tables.js
    else
        echo "❌ Arquivo create-tables.js não foi encontrado!"
    fi

    echo "✅ DynamoDB pronto para uso!"
}

main

