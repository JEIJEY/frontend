document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error('❌ No se encontró el formulario con id="loginForm"');
    return;
  }

  console.log("✅ Formulario de login encontrado");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Mostrar loading
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Iniciando sesión...";
    submitBtn.disabled = true;

    try {
      // Preparar datos
      const formData = new FormData(loginForm);
      const datos = {
        email: formData.get("email"),
        password: formData.get("password")
      };

      console.log("📤 Enviando datos de login:", datos);

      // Enviar petición al backend
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      console.log("📨 Status de respuesta:", response.status);

      // Manejar respuesta
      if (!response.ok) {
        const errorData = await response.json();
        console.log("🚨 ERROR DEL BACKEND:", errorData);
        
        // Mostrar errores en alert legible
        if (errorData.errors && errorData.errors.length > 0) {
          const erroresTexto = errorData.errors.join('\n• ');
          alert("❌ Errores:\n• " + erroresTexto);
        } else {
          alert("❌ Error: " + (errorData.message || "Credenciales inválidas"));
        }
        return;
      }

      // Login exitoso
      const result = await response.json();
      console.log("🎉 Login exitoso:", result);
      
      // Guardar token en localStorage
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      alert("✅ " + result.message);
      // Redirigir al dashboard
      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("💥 Error:", error);
      alert("💥 Error de conexión con el servidor");
    } finally {
      // Restaurar botón
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});