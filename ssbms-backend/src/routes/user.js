import express from "express";
import { authenticateUser, approveProvider, createUser, getUser, getUserById, toggleUserActive,  } from "../controllers/userController.js";
import{authenticateToken} from "../middleware/authToken.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
const router = express.Router();

//CREATE USER
router.post("/register",createUser);

//USER LOGIN
router.post("/login", authenticateUser);
//GET ALL USERS
router.get("/",authenticateToken, getUser);

//aprove provider
router.put("/approve-provider/:id", authenticateToken, (req,res,next)=>{
    if(req.user.role != "admin"){
        return res.status(403).json({msg: "Admin access only"});
    }
    next();
}, approveProvider)

router.put("/toggle-active/:id", authenticateToken, allowRoles("admin"), toggleUserActive);

//GET SINGLE USER BY ID
router.get("/:id", authenticateToken , getUserById);

export default router;