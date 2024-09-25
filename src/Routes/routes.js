import { login } from "../Controllers/AuthController";
import { logOut } from "../Controllers/AuthController";
import { verifyToken } from "../Controllers/Middleware/VerifyToken";
import { shortCode, shorten, getAllShortenedUrls, deleteShortenedUrl, editShortenedUrl } from "../Controllers/ShortenController";
import { createAccount, updateUserDetails, toggleUserActiveStatus, deleteUser} from "../Controllers/UserConreoller";

//login routes
app.post("/login", login);
app.put("/logout", verifyToken, logOut);

//User routes
app.post("/createAccount", createAccount);
app.post("/toggleUserActiveStatus", verifyToken, toggleUserActiveStatus);
app.put("/updateUserDetails", updateUserDetails);
app.delete("/deleteUser", deleteUser);

//Shorten Url
app.post("/shorten", verifyToken, shorten);
app.get("/:shortCode", shortCode);
app.get("/getAllShortenedUrls", verifyToken, getAllShortenedUrls);
app.delete("/deleteShortenedUrl", verifyToken, deleteShortenedUrl);
app.put("/editShortenedUrl", verifyToken, editShortenedUrl);
