import { login } from "../Controllers/AuthController"
import { logOut } from "../Controllers/AuthController"
import { verifyToken } from "../Controllers/Middleware/VerifyToken"
import { createAccount } from "../Controllers/UserConreoller"

//login routes
app.post("/login", login)
app.put("/logout", verifyToken, logOut)

//User routes
app.post("/createAccount", createAccount)