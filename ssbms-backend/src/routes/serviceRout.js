import express from "express";
import { createService, getService, getServiceById, getMyServices } from "../controllers/serviceController.js";
import { authenticateToken } from "../middleware/authToken.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { deleteService } from "../controllers/serviceController.js";
const router = express.Router();


router.get("/", getService);
router.get("/provider/me", authenticateToken, allowRoles("provider"), getMyServices);
router.delete("/delete/:id", authenticateToken, allowRoles("provider"), deleteService);
router.get("/:id", getServiceById);
router.post("/", authenticateToken, allowRoles("provider"), createService);
export default router;