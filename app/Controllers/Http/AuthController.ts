import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  // show the login view
  async showLogin({ view }: HttpContextContract) {
    return view.render("auth/login");
  }

  // trying to connect
  async login({ auth, request, response, session }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    try {
      await auth.use("web").attempt(email, password);
      response.redirect().toRoute("welcome");
    } catch {
      session.flash({ error: "Invalid credentials" });
      return response.redirect().back();
    }
  }

  // show the register view
  async register({ view }: HttpContextContract) {
    return view.render("auth/register");
  }

  // create new account
  async create({ request, response, session }: HttpContextContract) {
    const { name, email, password, confirmPassword } = request.all();

    try {
      // await auth.login(user) => login after account created
      if (!name || !email || !password || !confirmPassword) {
        session.flash({ error: "All fields are required !" });
        response.redirect().back();
      } else if (password !== confirmPassword) {
        session.flash({ error: "Password doesn't match" });
        response.redirect().back();
      } else {
        // create new user with form fields variables
        const user = await User.create({
          name: name,
          email: email,
          password: password,
        });
        session.flash({ success: "Account created ! You can now login :)" });
        response.redirect().toRoute("showLogin");
      }
    } catch (error) {
      throw error;
    }
  }

  async logout({ auth, response }: HttpContextContract) {
    await auth.use("web").logout();
    response.redirect().toRoute('login');
  }
}
