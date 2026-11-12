
document.addEventListener("DOMContentLoaded", () => {
    // Aguarda o HTML ser completamente carregado antes de executar o JavaScript.
    
    //===================
    // PÁGINA INICIAL
    //===================

    //===================
    // SINO TOCANDO MÚSICA
    //===================

    // Captura os elementos HTML que serão utilizados no controle da música.
    const botao = document.getElementById("botaoMusica");
    const sino = document.getElementById("iconeSino");
    const texto = document.getElementById("textoMusica");
    const musica = document.getElementById("musicaFundo");

    // Define o volume inicial da música em 30%.
    musica.volume = 0.3;

   
    botao.addEventListener("click", async () => {

        // Verifica se a música está pausada.
        if (musica.paused) {

            try {
                
                await musica.play();

              
                sino.classList.add("tocando");

                // Atualiza o texto do botão.
                texto.textContent = "Parar música";

            } catch (erro) {
                
                console.error("Não foi possível reproduzir a música:", erro);
            }

        } else {

            // Pausa a música.
            musica.pause();

            // Remove a classe CSS e interrompe a animação do sino.
            sino.classList.remove("tocando");

            // Atualiza o texto do botão.
            texto.textContent = "Tocar música";
        }
    });

    //===================
    // PARALLAX
    //===================

    // Seleciona a seção que contém o efeito parallax.
    const secao = document.querySelector(".parallax");

    // Interrompe a execução desta parte caso a seção não exista na página.
    if (!secao) return;

    // Seleciona individualmente as imagens que formam as camadas do cenário.
    const ceu = document.querySelector("#ceu");
    const floresta = document.querySelector("#floresta");
    const vila = document.querySelector("#vila");
    const noel = document.querySelector("#noel");

    // Limita um valor para que ele permaneça entre um mínimo e um máximo.
    function limitar(valor, minimo, maximo) {
        return Math.max(minimo, Math.min(maximo, valor));
    }

    // Calcula e atualiza o movimento das camadas conforme a rolagem da página.
    function atualizarParallax() {

        const alturaTela = window.innerHeight;


        const posicao = secao.getBoundingClientRect();

 
        const distancia = secao.offsetHeight - alturaTela;

        // Calcula o progresso da rolagem, transformando-o em um valor entre 0 e 1.
        const progresso = limitar(
            distancia > 0 ? -posicao.top / distancia : 0,
            0,
            1
        );

        // Define a distância de movimento de cada camada.
     
        const movimentoCeu = progresso * 100;
        const movimentoFloresta = progresso * 115;
        const movimentoVila = progresso * 135;
        const movimentoNoel = progresso * 145;

        // Calcula a opacidade para fazer as camadas desaparecerem gradualmente.
        const desaparecer = 1 - progresso;

        
        ceu.style.transform =
            `translateY(${movimentoCeu}vh)`;

        ceu.style.opacity = desaparecer;

       
        floresta.style.transform =
            `translateY(${movimentoFloresta}vh)`;

        floresta.style.opacity = desaparecer;

        
        vila.style.transform =
            `translateY(${movimentoVila}vh)`;

        vila.style.opacity = desaparecer;

    
        const movimentoHorizontalNoel = progresso * 25;

        // Movimenta o Papai Noel nos dois eixos e aplica uma pequena rotação.
        noel.style.transform = `
            translate(${movimentoHorizontalNoel}vw, ${movimentoNoel}vh)
            rotate(${progresso * 4}deg)
        `;

        // Faz o Papai Noel desaparecer próximo ao final da animação.
        noel.style.opacity = limitar(
            1 - Math.max(0, (progresso - 0.75) / 0.25),
            0,
            1
        );
    }

    //atualiza sempre que o usuário rolar a página.
    window.addEventListener("scroll", atualizarParallax);

    
    window.addEventListener("resize", atualizarParallax);

    
    atualizarParallax();

    //===================
    // SLIDESHOW
    //===================

    // Seleciona todos os elementos que representam os slides.
    const slides = document.querySelectorAll(".slide");

    // Verifica se existem slides antes de executar o slideshow.
    if (slides.length > 0) {

       
        let indiceAtual = 0;

        // Captura os botões de navegação e o indicador de posição.
        const anterior = document.querySelector("#anterior");
        const proximo = document.querySelector("#proximo");
        const indicador = document.querySelector("#indicador");

      
        function mostrarSlide(indice) {

            // Remove a classe ativo de todos os slides.
            slides.forEach(slide => {
                slide.classList.remove("ativo");
            });

            
            slides[indice].classList.add("ativo");

            // Atualiza o indicador com o número atual e o total de slides.
            indicador.textContent =
                `${String(indice + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
        }

        // Verifica se todos os elementos necessários existem.
        if (anterior && proximo && indicador) {

        
            proximo.addEventListener("click", () => {

                // O operador % permite retornar ao primeiro slide
                indiceAtual = (indiceAtual + 1) % slides.length;

                mostrarSlide(indiceAtual);
            });

            // Retorna para o slide anterior.
            anterior.addEventListener("click", () => {

                // A soma de slides.length evita que o índice fique negativo.
                indiceAtual = (indiceAtual - 1 + slides.length) % slides.length;

                mostrarSlide(indiceAtual);
            });

            // Exibe o primeiro slide ao inicializar.
            mostrarSlide(indiceAtual);
        }
    }

    //===================
    // ANIMAÇÃO DO SLIDESHOW AO ROLAR
    //===================

    const slideshow = document.querySelector(".slideshow");

    // Só cria o observador se o slideshow existir.
    if (slideshow) {

        // IntersectionObserver identifica quando um elemento entra na área visível.
        const observador = new IntersectionObserver((entradas) => {

            entradas.forEach(entrada => {

                
                if (entrada.isIntersecting) {

                    
                    slideshow.classList.add("visivel");

                   
                    observador.unobserve(slideshow);
                }
            });

        }, {
            
            threshold: 0.15
        });

        // Inicia a observação do slideshow.
        observador.observe(slideshow);
    }

    //===================
    // DESTAQUES DA LOJA
    //===================

    // Seleciona o espaço HTML onde os cards serão inseridos.
    const gradeDestaques = document.querySelector("#grade-destaques");

    
    if (gradeDestaques && typeof produtos !== "undefined") {

        // Filtra apenas os produtos marcados como destaque.
        const produtosDestaque = produtos
            .filter(produto => produto.destaque === true)
            .slice(0, 6); //primeiros 6 produtos

        // Percorre os produtos selecionados para criar seus cards.
        produtosDestaque.forEach((produto, indice) => {

            
            const card = document.createElement("article");

        
            card.classList.add("card-destaque");


            // Define um atraso diferente para cada card.
            card.style.transitionDelay = `${indice * 120}ms`;

            // Insere a estrutura HTML e as informações do produto.
            card.innerHTML = `
                <div class="card-imagem">
                    <img src="${produto.imagem}" alt="${produto.nome}">
                </div>

                <div class="card-conteudo">

                   <h3>${produto.nome}</h3>

                   <p>${produto.descrição}</p>

                   <span class="card-preco">
                     R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}
                   </span>

                    <span class="card-quantidade">
                        Quantidade: ${produto.quantidade}
                    </span>

                   <a href="produtos.html#produtos" class="card-botao">
                    Comprar
                   </a>

                </div>
            `;

            // Adiciona o card criado dentro da grade de destaques.
            gradeDestaques.appendChild(card);
        });
    }

    //===================
    // ANIMAÇÃO DOS CARDS DE DESTAQUE
    //===================

    // Seleciona todos os cards criados anteriormente.
    const cards = document.querySelectorAll(".card-destaque");

    if (cards.length > 0) {

        // Observa cada card para identificar quando ele aparece na tela.
        const observadorDestaques = new IntersectionObserver(
            (entradas, observador) => {

                entradas.forEach(entrada => {

                    if (entrada.isIntersecting) {

                        // Ativa a animação do card por meio do CSS.
                        entrada.target.classList.add("visivel");

                        // Deixa de observar o card depois que ele aparece.
                        observador.unobserve(entrada.target);
                    }
                });
            },
            {
                // Exige que pelo menos 15% do card esteja visível.
                threshold: 0.15
            }
        );

        
        cards.forEach(card => {
            observadorDestaques.observe(card);
        });
    }

    //===================
    // ANIMAÇÃO DA CHAMADA FINAL
    //===================

    const chamadaFinal = document.querySelector(".chamada-final");

    if (chamadaFinal) {

        // Observa a seção final para ativar sua animação ao entrar na tela.
        const observadorChamada = new IntersectionObserver(
            (entradas, observador) => {

                entradas.forEach(entrada => {

                    if (entrada.isIntersecting) {

                        // Adiciona a classe responsável pela animação no CSS.
                        chamadaFinal.classList.add("visivel");

                        // Encerra a observação depois da animação.
                        observador.unobserve(chamadaFinal);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        observadorChamada.observe(chamadaFinal);
    }

    //===================
    // EFEITO DE NEVE
    //===================

    // Cria um elemento canvas diretamente pelo JavaScript.
    const canvasNeve = document.createElement("canvas");

    canvasNeve.id = "neve";

    // Impede que o canvas seja anunciado por leitores de tela,
    canvasNeve.setAttribute("aria-hidden", "true");

    // Insere o canvas no corpo da página.
    document.body.appendChild(canvasNeve);

    
    const ctx = canvasNeve.getContext("2d");

    // Variáveis que armazenam as dimensões da tela.
    let larguraTela;
    let alturaTela;

   
    let flocos = [];

    // Define a quantidade de flocos de acordo com a largura da tela.
    const quantidadeFlocos = window.innerWidth < 768 ? 35 : 65;

    
    function ajustarCanvas() {

        // Considera a resolução do dispositivo, limitada a 2.
        const escala = Math.min(window.devicePixelRatio || 1, 2);

        larguraTela = window.innerWidth;
        alturaTela = window.innerHeight;

       
        canvasNeve.width = larguraTela * escala;
        canvasNeve.height = alturaTela * escala;

        // Corrige a escala de desenho para manter o tamanho visual adequado.
        ctx.setTransform(escala, 0, 0, escala, 0, 0);
    }

    // Cria um floco com características aleatórias.
    function criarFloco() {

        return {
            // Posição inicial horizontal e vertical.
            x: Math.random() * larguraTela,
            y: Math.random() * alturaTela,

            
            tamanho: Math.random() * 2.5 + 1,

            
            velocidade: Math.random() * 0.8 + 0.4,

            
            vento: Math.random() * 0.5 - 0.25,

           
            opacidade: Math.random() * 0.4 + 0.3
        };
    }

    // Prepara o canvas e cria todos os flocos de neve.
    function iniciarNeve() {

        ajustarCanvas();

        
        flocos = [];

        // Repetição responsável por criar a quantidade definida de flocos.
        for (let i = 0; i < quantidadeFlocos; i++) {

            flocos.push(criarFloco());
        }
    }

   
    function animarNeve() {

        // Limpa o desenho anterior para permitir um novo quadro da animação.
        ctx.clearRect(0, 0, larguraTela, alturaTela);

        
        flocos.forEach(flocos => {

            
            ctx.beginPath();

            // Desenha um círculo que representa o floco de neve.
            ctx.arc(
                flocos.x,
                flocos.y,
                flocos.tamanho,
                0,
                Math.PI * 2
            );

           
            ctx.fillStyle = `rgba(255, 255, 255, ${flocos.opacidade})`;

            // Preenche o círculo desenhado.
            ctx.fill();

          
            flocos.y += flocos.velocidade;

           
            flocos.x += flocos.vento;

            // Quando o floco ultrapassa a parte inferior, ele retorna ao topo em uma posição horizontal aleatória.
            if (flocos.y > alturaTela + 5) {

                flocos.y = -5;
                flocos.x = Math.random() * larguraTela;
            }

            // Faz o floco reaparecer no lado oposto se ultrapassar a direita.
            if (flocos.x > larguraTela + 5) {

                flocos.x = -5;
            }

            // Faz o floco reaparecer à direita se ultrapassar a esquerda.
            if (flocos.x < -5) {

                flocos.x = larguraTela + 5;
            }
        });

        
        requestAnimationFrame(animarNeve);
    }

    // Verifica se o usuário prefere reduzir animações no dispositivo.
    const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    
    if (!movimentoReduzido.matches) {

        iniciarNeve();

        animarNeve();

        // Recalcula as dimensões e reinicializa os flocos ao redimensionar.
        window.addEventListener("resize", iniciarNeve);
    }
});

//===================
// PÁGINA PRODUTOS
//===================

document.addEventListener("DOMContentLoaded", () => {

    

    // ========================================
    // ELEMENTOS HTML
    // ========================================

    // Captura os elementos responsáveis pela listagem, busca e filtros.
    const container = document.getElementById("container-produtos");
    const inputBusca = document.getElementById("campo-busca");
    const selectCategoria = document.getElementById("filtro-categoria");
    const contador = document.getElementById("contador-produtos");
    const mensagemVazia = document.getElementById("mensagem-vazia");

    // Captura os elementos utilizados pelo modal de detalhes.
    const modal = document.getElementById("modal-detalhes");
    const fecharModalBtn = document.getElementById("fechar-modal");

    const modalImagem = document.getElementById("modal-imagem");
    const modalCategoria = document.getElementById("modal-categoria");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalQuantidade = document.getElementById("modal-quantidade");
    const modalDescricao = document.getElementById("modal-descricao");
    const modalPreco = document.getElementById("modal-preco");
    const modalBtnComprar = document.getElementById("modal-btn-comprar");

    // Captura o espaço onde serão exibidas as mensagens de confirmação.
    const toastContainer = document.getElementById("toast-container");

    // ========================================
    // VERIFICAR PRODUTOS
    // ========================================

    // Confere se o arquivo produtos.js foi carregado
    if (typeof produtos === "undefined") {
        console.error("Erro: produtos.js não foi carregado!");
        return;
    }

    // ========================================
    // FORMATAÇÃO DE PREÇO
    // ========================================

    
    function formatarPreco(preco) {

        return Number(preco).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // ========================================
    // MENSAGEM DE CONFIRMAÇÃO
    // ========================================

   
    function adicionarAoCarrinho(id) {

        // Procura no array o produto que possui o ID recebido.
        const produto = produtos.find(p => p.id === Number(id));


        if (!produto) {
            console.error("Produto não encontrado!");
            return;
        }

        // Verifica se o container de mensagens existe.
        if (!toastContainer) return;

       
        const toast = document.createElement("div");

        // Adiciona a classe CSS e define o texto da mensagem.
        toast.classList.add("toast");
        toast.textContent = `${produto.nome} foi adicionado ao carrinho!`;

       
        toastContainer.appendChild(toast);

        // Remove a notificação automaticamente após três segundos.
        setTimeout(() => {
            toast.remove();
        }, 3000);

       
        console.log("Compra adicionada:", produto.nome);
    }

    // ========================================
    // ABRIR MODAL
    // ========================================

    // Localiza o produto pelo ID e preenche o modal com suas informações.
    function abrirModal(id) {

        const produto = produtos.find(p => p.id === Number(id));

        // Verifica se o produto e o modal existem.
        if (!produto || !modal) return;

        
        const descricao = produto.descrição ?? produto.descricao ?? "";

        // Garante que a descrição seja um texto, mesmo que seja um array
        const textoDescricao = Array.isArray(descricao)
            ? descricao.join(" ")
            : descricao;

       
        modalImagem.src = produto.imagem;
        modalImagem.alt = produto.nome;

        // Preenche as informações do produto no modal.
        modalCategoria.textContent = produto.categoria;
        modalTitulo.textContent = produto.nome;

        // Exibe a quantidade 
        modalQuantidade.textContent = produto.quantidade
            ? `Quantidade: ${produto.quantidade}`
            : "";

        modalDescricao.textContent = textoDescricao;

        // Apresenta o preço
        modalPreco.textContent = formatarPreco(produto.preco);


        // Define o comportamento do botão de compra do modal.
        modalBtnComprar.onclick = () => {
            adicionarAoCarrinho(produto.id);
            fecharModal();
        };

        // Torna o modal visível.
        modal.style.display = "flex";

        console.log("Modal aberto:", produto.nome);
    }

    // ========================================
    // FECHAR MODAL
    // ========================================

    // Oculta a janela de detalhes.
    function fecharModal() {

        if (modal) {
            modal.style.display = "none";
        }
    }

    // Fecha o modal ao clicar no botão de fechar.
    if (fecharModalBtn) {
        fecharModalBtn.addEventListener("click", fecharModal);
    }

    // Fecha o modal quando o usuário clica fora da área de conteúdo.
    if (modal) {

        modal.addEventListener("click", (evento) => {


            // A condição impede que cliques dentro do conteúdo fechem o modal.
            if (evento.target === modal) {
                fecharModal();
            }
        });
    }

    // Permite fechar o modal pressionando a tecla Escape.
    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            fecharModal();
        }
    });

    // ========================================
    // CRIAR CARDS DOS PRODUTOS
    // ========================================

    // Recebe uma lista de produtos e monta os respectivos cards no HTML.
    function renderizarProdutos(lista) {

        if (!container) return;


        // Limpa os cards anteriores antes de inserir os novos.
        container.innerHTML = "";

        // Atualiza o contador de produtos exibidos.
        if (contador) {
            contador.textContent =
                `Mostrando ${lista.length} de ${produtos.length} produtos`;
        }

        // Verifica se a lista está vazia.
        if (lista.length === 0) {

            // Exibe a mensagem informando que nenhum produto foi encontrado.
            if (mensagemVazia) {
                mensagemVazia.style.display = "block";
            }

            return;
        }

        // Oculta a mensagem quando existem produtos para exibir.
        if (mensagemVazia) {
            mensagemVazia.style.display = "none";
        }

        // Percorre a lista recebida para construir cada card.
        lista.forEach(produto => {

            // Cria o elemento principal do card.
            const card = document.createElement("div");
            card.classList.add("card-produto");

            // -------------------------
            // IMAGEM
            // -------------------------

            const imagem = document.createElement("img");

            imagem.src = produto.imagem;
            imagem.alt = produto.nome;

            // Carrega a imagem quando ela estiver próxima de aparecer na tela.
            imagem.loading = "lazy";

            // Abre o modal ao clicar na imagem.
            imagem.addEventListener("click", () => {
                abrirModal(produto.id);
            });

            // -------------------------
            // CATEGORIA
            // -------------------------

            const categoria = document.createElement("span");

            categoria.classList.add("categoria-tag");
            categoria.textContent = produto.categoria;

            // -------------------------
            // TÍTULO
            // -------------------------

            const titulo = document.createElement("h3");

            titulo.classList.add("titulo");
            titulo.textContent = produto.nome;

            // Também permite abrir o modal pelo nome do produto.
            titulo.addEventListener("click", () => {
                abrirModal(produto.id);
            });

            // -------------------------
            // PREÇO
            // -------------------------

            const preco = document.createElement("p");

            preco.classList.add("preco");
            preco.textContent = formatarPreco(produto.preco);

            // -------------------------
            // BOTÃO COMPRAR
            // -------------------------

            const botaoComprar = document.createElement("button");

            botaoComprar.textContent = "Comprar";

            // Chama a função de confirmação quando o botão é clicado.
            botaoComprar.addEventListener("click", () => {
                adicionarAoCarrinho(produto.id);
            });

            // -------------------------
            // MONTAR CARD
            // -------------------------

            // Insere todos os elementos criados dentro do card.
            card.append(
                imagem,
                categoria,
                titulo,
                preco,
                botaoComprar
            );

            // Insere o card completo no container de produtos.
            container.appendChild(card);
        });
    }

    // ========================================
    // BUSCA E FILTROS
    // ========================================

    // Filtra os produtos conforme o texto digitado e a categoria selecionada.
    function aplicarFiltros() {


        // Obtém o texto da busca.
        const termo = inputBusca
            ? inputBusca.value.toLowerCase().trim()
            : "";


        // Obtém a categoria selecionada.
        const categoria = selectCategoria
            ? selectCategoria.value.toLowerCase()
            : "todos";

        // filter cria uma nova lista contendo somente os produtos
        // que atendem simultaneamente às duas condições.
        const filtrados = produtos.filter(produto => {

            // Verifica se o nome do produto contém o texto pesquisado.
            const correspondeNome =
                produto.nome.toLowerCase().includes(termo);

            // Verifica se a categoria corresponde à seleção.
            // A opção todos permite exibir qualquer categoria.
            const correspondeCategoria =
                categoria === "todos" ||
                produto.categoria.toLowerCase() === categoria;

            // O operador && exige que as duas condições sejam verdadeiras.
            return correspondeNome && correspondeCategoria;
        });

        // Atualiza os cards com a lista filtrada.
        renderizarProdutos(filtrados);
    }

    // Atualiza os resultados enquanto o usuário digita.
    if (inputBusca) {
        inputBusca.addEventListener("input", aplicarFiltros);
    }

    // Atualiza os resultados quando a categoria é alterada.
    if (selectCategoria) {
        selectCategoria.addEventListener("change", aplicarFiltros);
    }

    // ========================================
    // INICIALIZAÇÃO
    // ========================================

    // Executa a busca inicialmente sem filtros para exibir todos os produtos.
    aplicarFiltros();

    console.log("Todos os eventos foram registrados!");

});

//===================
// PÁGINA DA GALERIA
//===================

document.addEventListener("DOMContentLoaded", () => {

    // Seleciona todas as imagens que pertencem à galeria.
    const imagens = document.querySelectorAll(".galeria img");

    // Interrompe esta parte se a página não possuir imagens da galeria.
    if (imagens.length === 0) return;

    // Cria o fundo que será utilizado para ampliar as imagens.
    const lightbox = document.createElement("div");
    lightbox.classList.add("lightbox");

    // Cria a imagem que será exibida em tamanho ampliado.
    const imagemAmpliada = document.createElement("img");
    imagemAmpliada.classList.add("lightbox-imagem");

    // Cria o botão de fechar utilizando o símbolo de multiplicação.
    const fechar = document.createElement("span");
    fechar.classList.add("lightbox-fechar");
    fechar.innerHTML = "&times;";

    // Insere o botão e a imagem ampliada dentro do lightbox.
    lightbox.appendChild(fechar);
    lightbox.appendChild(imagemAmpliada);

    // Cria o espaço destinado à descrição da imagem.
    const textoAmpliado = document.createElement("p");
    textoAmpliado.classList.add("lightbox-texto");

    lightbox.appendChild(textoAmpliado);

    // Adiciona o lightbox ao documento.
    document.body.appendChild(lightbox);

    // Percorre todas as imagens para registrar o evento de clique.
    imagens.forEach(imagem => {

        imagem.addEventListener("click", () => {

            // Copia o endereço e o texto alternativo da imagem original.
            imagemAmpliada.src = imagem.src;
            imagemAmpliada.alt = imagem.alt;

            // Adiciona a classe que torna o lightbox visível pelo CSS.
            lightbox.classList.add("ativo");

            // Obtém o texto do elemento HTML que vem logo depois da imagem.
            textoAmpliado.textContent = imagem.nextElementSibling.textContent;
        });
    });

    // Fecha o lightbox ao clicar no símbolo de fechar.
    fechar.addEventListener("click", () => {
        lightbox.classList.remove("ativo");
    });

    // Também fecha quando o usuário clica na área escura fora da imagem.
    lightbox.addEventListener("click", (evento) => {

        if (evento.target === lightbox) {
            lightbox.classList.remove("ativo");
        }
    });

    // Permite fechar a imagem ampliada com a tecla Escape.
    document.addEventListener("keydown", (evento) => {

        if (evento.key === "Escape") {
            lightbox.classList.remove("ativo");
        }
    });
});

//===================
// PÁGINA DO CONTATO
//===================

document.addEventListener("DOMContentLoaded", () => {

    // Captura o formulário pelo seu ID.
    const formulario = document.getElementById("formContato");

    // Registra o evento que será executado quando o formulário for enviado.
    formulario.addEventListener("submit", (evento) => {

        // Impede o comportamento padrão do formulário,
        // que enviaria os dados e poderia recarregar a página.
        evento.preventDefault();

        // Captura os campos preenchidos pelo usuário.
        const nome = document.getElementById("nome");
        const email = document.getElementById("email");
        const assunto = document.getElementById("assunto");
        const mensagem = document.getElementById("mensagem");

        // Captura o elemento que exibirá o resultado da validação.
        const resultado = document.getElementById("resultado");

        // Variável que controla se todos os campos estão válidos.
        let valido = true;

        // -------------------------
        // LIMPAR ERROS ANTERIORES
        // -------------------------

        // Remove as mensagens de erro da tentativa anterior.
        document.querySelectorAll(".erro").forEach(erro => {
            erro.textContent = "";
        });

        // Remove a classe que destaca visualmente os campos inválidos.
        document.querySelectorAll(".campo input, .campo textarea")
            .forEach(campo => {
                campo.classList.remove("invalido");
            });

        // Limpa a mensagem e as classes do resultado anterior.
        resultado.textContent = "";
        resultado.className = "";

        // -------------------------
        // FUNÇÃO PARA MOSTRAR ERROS
        // -------------------------

        // Centraliza a exibição de erros para evitar repetir o mesmo código.
        function mostrarErro(campo, texto) {

            // Destaca o campo com a classe CSS de erro.
            campo.classList.add("invalido");

            // Localiza o elemento .erro dentro do mesmo campo
            // e insere a mensagem correspondente.
            campo.parentElement.querySelector(".erro")
                .textContent = texto;

            // Informa que a validação não foi aprovada.
            valido = false;
        }

        // -------------------------
        // VALIDAÇÃO DO NOME
        // -------------------------

        // trim remove espaços. Se não sobrar nenhum conteúdo,
        // o campo será considerado vazio.
        if (nome.value.trim() === "") {
            mostrarErro(nome, "Digite seu nome.");
        }

        // -------------------------
        // VALIDAÇÃO DO E-MAIL
        // -------------------------

        // Expressão regular que verifica uma estrutura básica de e-mail:
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.value.trim() === "") {

            // Exibe erro se o usuário não preencher o e-mail.
            mostrarErro(email, "Digite seu e-mail.");

        } else if (!emailValido.test(email.value.trim())) {

            // test verifica se o texto corresponde à expressão regular.
            mostrarErro(email, "Digite um e-mail válido.");
        }

        // -------------------------
        // VALIDAÇÃO DO ASSUNTO
        // -------------------------

        if (assunto.value.trim() === "") {
            mostrarErro(assunto, "Digite o assunto.");
        }

        // -------------------------
        // VALIDAÇÃO DA MENSAGEM
        // -------------------------

        if (mensagem.value.trim() === "") {
            mostrarErro(mensagem, "Digite sua mensagem.");
        }

        // -------------------------
        // RESULTADO DA VALIDAÇÃO
        // -------------------------

        // Só executa quando todos os campos forem aprovados.
        if (valido) {

            // Exibe a mensagem de sucesso.
            resultado.textContent =
                "Mensagem enviada com sucesso!";

            // Adiciona a classe CSS responsável pela aparência de sucesso.
            resultado.classList.add("sucesso");

            // Limpa os campos do formulário.
            formulario.reset();
        }

        
    });
});

//========================
// PÁGINA SOBRE A HISTÓRIA
//========================

document.addEventListener("DOMContentLoaded", () => {

    //========================
    // ANIMAÇÃO DO CARD DA HISTÓRIA
    //========================

    // Seleciona o card que receberá a animação durante a rolagem.
    const cardHistoria = document.querySelector(".card-historia");

    if (cardHistoria) {

        // Identifica quando o card entra na área visível da tela.
        const observador = new IntersectionObserver((entradas) => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    // Adiciona a classe que ativa a animação pelo CSS.
                    cardHistoria.classList.add("visivel");

                    // Para de observar depois da primeira aparição.
                    observador.unobserve(cardHistoria);
                }
            });

        }, {
            // Ativa a animação quando 20% do card estiver visível.
            threshold: 0.2
        });

        // Inicia a observação do card.
        observador.observe(cardHistoria);
    }

    //========================
    // CONTAGEM REGRESSIVA PARA O NATAL
    //========================

    // Captura os elementos que apresentarão os valores da contagem.
    const dias = document.getElementById("dias");
    const horas = document.getElementById("horas");
    const minutos = document.getElementById("minutos");
    const segundos = document.getElementById("segundos");

    // Calcula quanto tempo falta para a próxima data de Natal.
    function atualizarNatal() {

        // Obtém a data e o horário atuais.
        const agora = new Date();

        // Começa considerando o ano atual.
        let anoNatal = agora.getFullYear();

        // Cria a data do Natal.
        // Os meses começam em zero no JavaScript:
        // 0 = janeiro, 11 = dezembro.
        let natal = new Date(anoNatal, 11, 25, 0, 0, 0);

        // Se o Natal já passou, considera o dia 25 de dezembro do próximo ano.
        // A segunda condição evita avançar o ano quando já é dia 25.
        if (
            agora > natal &&
            !(agora.getMonth() === 11 && agora.getDate() === 25)
        ) {
            anoNatal++;
            natal = new Date(anoNatal, 11, 25, 0, 0, 0);
        }

        // Subtrai as datas para obter a diferença em milissegundos.
        const diferenca = natal - agora;

        // Verifica se a contagem chegou ao fim.
        if (diferenca <= 0) {

            // Define todos os valores como zero.
            dias.textContent = "00";
            horas.textContent = "00";
            minutos.textContent = "00";
            segundos.textContent = "00";

            return;
        }

        // -------------------------
        // CONVERSÃO DO TEMPO
        // -------------------------


        // Calcula os dias completos restantes.
        const d = Math.floor(diferenca / (1000 * 60 * 60 * 24));

        // Calcula as horas restantes, desconsiderando os dias completos.
        const h = Math.floor(
            (diferenca / (1000 * 60 * 60)) % 24
        );

        // Calcula os minutos restantes, desconsiderando as horas completas.
        const m = Math.floor(
            (diferenca / (1000 * 60)) % 60
        );

        // Calcula os segundos restantes.
        const s = Math.floor(
            (diferenca / 1000) % 60
        );

        // Atualiza os elementos HTML com os valores calculados.
        // padStart acrescenta um zero à esquerda quando necessário.
        dias.textContent = String(d).padStart(2, "0");
        horas.textContent = String(h).padStart(2, "0");
        minutos.textContent = String(m).padStart(2, "0");
        segundos.textContent = String(s).padStart(2, "0");
    }

    // Executa imediatamente para não esperar o primeiro intervalo.
    atualizarNatal();

    // Atualiza a contagem a cada 1000 milissegundos (1 segundo).
    setInterval(atualizarNatal, 1000);

    //========================
    // ANIMAÇÃO DOS ELEMENTOS NATALINOS
    //========================

    // Seleciona os elementos que receberão animação ao aparecer na tela.
    const elementosNatal = document.querySelectorAll(
        ".card-historia, .contagem-natal"
    );

    if (elementosNatal.length > 0) {

        // Cria um observador para acompanhar os elementos selecionados.
        const observadorNatal = new IntersectionObserver((entradas) => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    // Adiciona a classe que ativa a animação no CSS.
                    entrada.target.classList.add("visivel");

                    // Encerra a observação daquele elemento após a animação.
                    observadorNatal.unobserve(entrada.target);
                }
            });

        }, {
            threshold: 0.2
        });

        // Registra cada elemento no observador.
        elementosNatal.forEach(elemento => {
            observadorNatal.observe(elemento);
        });
    }
});