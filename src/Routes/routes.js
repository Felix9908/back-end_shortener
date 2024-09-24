import { login } from "../Controllers/AuthController";
import { logOut } from "../Controllers/AuthController";
import { verifyToken } from "../Controllers/Middleware/VerifyToken";
import { shortCode, shorten } from "../Controllers/ShortenController";
import { createAccount, updateUserDetails, toggleUserActiveStatus} from "../Controllers/UserConreoller";

//login routes
app.post("/login", login);
app.put("/logout", verifyToken, logOut);

//User routes
app.post("/createAccount", createAccount);
app.post("/toggleUserActiveStatus", toggleUserActiveStatus);
app.post("/updateUserDetails", updateUserDetails);

//Shorten Url
app.post("/shorten", shorten);
app.get("/:shortCode", shortCode);
