import { Router } from "express";
import * as DropdownMasterController from "../controllers/DropDownMasterController";

const dropdownMasterRouter = Router();

dropdownMasterRouter.post("/", DropdownMasterController.createDropdown);
dropdownMasterRouter.put(
  "/:dropdownName",
  DropdownMasterController.updateDropdown
);
dropdownMasterRouter.get("/", DropdownMasterController.getAllDropdowns);
dropdownMasterRouter.get(
  "/:dropdownName",
  DropdownMasterController.getDropdown
);
dropdownMasterRouter.delete(
  "/:dropdownName",
  DropdownMasterController.deleteDropdown
);

export default dropdownMasterRouter;
