$(document).ready(function() {
        let chatHistory = [];
        let userAvatar = "https://i.pravatar.cc/28?u=user";
        
        /* Kalo mau, ubah sesuai web api/gambar masing-masing
        api: "Link Api Lu",
        avatar: "Link/Lokasi Foto Yang Mau Lu Jadiin PP AInya"
        */
        const aiModels = {
                luminai: {
                        api: "https://api.siputzx.my.id/api/ai/luminai?content=",
                        avatar: "https://files.catbox.moe/fqhtx5.jpg"
                },
                latukam: {
                        api: "https://api.siputzx.my.id/api/ai/blackboxai?content=Kamu+adalah+salah+satu+teman+ngobrol+yang+memiliki+sifat+cuek+dan+singkat%2C+mengekspresikan+sifat+mu+dengan+emoji+dan+menggunakan+bahasa+gaul+orang+Indonesia+%E2%80%9CLu%2C+gua%2C+anjir%2C+gtw%2C+bodo+amat%2Cgak+peduli%2C+goblok%2C+bego%E2%80%9D%2C+kamu+di+tugaskan+untuk+menjadi+teman+berbicara+yang+baik+tapi+dengan+bahasa+gaul+dengan+menjawab+pertanyaan+terkait+hal+hal+random.+Nah%2C+sekarang+coba+respon+pesan+dari+saya%3A+",
                        avatar: "https://raw.githubusercontent.com/LemonSync/LemonSync/main/Lemon_Laugh.jpg"
                },
                dukun: {
                        api: "https://api.siputzx.my.id/api/ai/dukun?content=",
                        avatar: "https://raw.githubusercontent.com/LemonSync/LemonSync/main/Lemon_Dukun.jpg"
                },
                esia: {
                        api: "https://api.siputzx.my.id/api/ai/esia?content=",
                        avatar: "https://raw.githubusercontent.com/LemonSync/LemonSync/main/Julie.jpg"
                },
                joko: {
                        api: "https://api.siputzx.my.id/api/ai/joko?content=",
                        avatar: "https://raw.githubusercontent.com/LemonSync/LemonSync/main/Lemon_Jawa.jpg"
                }
        };
        
        let selectedModel = "luminai"; // Biar AI ini yang default
        let botAvatar = aiModels[selectedModel].avatar; // Fotonya ini default
        
        function escapeHTML(str) {
                return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
        
        function addMessage(text, isUser) {
                let avatar = isUser ? userAvatar : botAvatar;
                let senderName = isUser ? "Kamu" : "LemonAI";
                
                let containerClass = isUser ? "message-container user" : "message-container";
                
                let messageHTML = `
            <div class="${containerClass}">
                <img src="${avatar}" alt="Avatar">
                <div class="message ${isUser ? 'message-personal' : ''}">
                    <strong>${senderName}:</strong><br>${escapeHTML(text)}
                </div>
            </div>
        `;
                
                $(".messages").append(messageHTML);
                $(".messages").scrollTop($(".messages")[0].scrollHeight);
        }
        
        function showTypingIndicator() {
                let typingHTML = `
            <div class="message-container bot typing">
                <div class="message">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
                $(".messages").append(typingHTML);
                $(".messages").scrollTop($(".messages")[0].scrollHeight);
        }
        
        function removeTypingIndicator() {
                $(".typing").remove();
        }
        
        function getBotReply(userMessage) {
                chatHistory.push({ role: "user", content: userMessage });
                
                let chatContext = chatHistory.map(msg => `${msg.role}: ${msg.content}`).join("\n");
                let apiUrl = aiModels[selectedModel].api + encodeURIComponent(chatContext);
                
                if (!navigator.onLine) {
                        addMessage("Tidak ada koneksi internet. Silakan coba lagi nanti.", false);
                        return;
                }
                
                showTypingIndicator();
                
                fetch(apiUrl)
                        .then(response => response.json())
                        .then(data => {
                                removeTypingIndicator();
                                if (data && data.status && data.data) {
                                        let botResponse = data.data.replace(/^(bot:|luminAi:)/i, "").trim();
                                        
                                        addMessage(botResponse, false);
                                        chatHistory.push({ role: "bot", content: botResponse });
                                } else {
                                        addMessage("Maaf, bot tidak bisa menjawab saat ini.", false);
                                }
                        })
                        .catch(error => {
                                removeTypingIndicator();
                                addMessage("Terjadi kesalahan saat menghubungi server. Coba lagi nanti.", false);
                        });
        }
        
        $("#send").click(function() {
                let msg = $("#message-input").val().trim();
                if (msg) {
                        addMessage(msg, true);
                        $("#message-input").val("");
                        getBotReply(msg);
                }
        });
        
        $("#message-input").keypress(function(e) {
                if (e.which == 13) {
                        e.preventDefault();
                        $("#send").click();
                }
        });
        
        $("#model-selector").change(function() {
                selectedModel = $(this).val();
                botAvatar = aiModels[selectedModel].avatar; 
                
                $(".messages").html("");
                chatHistory = []; // Kalo ganti model, sesi chatnya terhapus
                
                addMessage(`AI sekarang menggunakan model: ${selectedModel.toUpperCase()}`, false);
        });
        
});