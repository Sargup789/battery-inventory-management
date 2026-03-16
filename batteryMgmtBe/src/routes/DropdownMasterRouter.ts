import { Router } from "express";
import * as ctrl from "../controllers/DropdownMasterController";

const dropdownMasterRouter = Router();

dropdownMasterRouter.post("/", ctrl.createDropdown);
dropdownMasterRouter.get("/", ctrl.getAllDropdowns);
dropdownMasterRouter.get("/:dropdownName", ctrl.getDropdown);
dropdownMasterRouter.put("/:dropdownName", ctrl.updateDropdown);
dropdownMasterRouter.delete("/:dropdownName", ctrl.deleteDropdown);

export default dropdownMasterRouter;
