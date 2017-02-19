/* shared modals */
import * as angular from "angular";
import {ModalAlertController} from "./modal-alert/modal-alert.controller";
import {ModalConfirmerController} from "./modal-confirmer/modal-confirmer.controller";

// shared modals
export const mcModals = angular.module("shared.modals", [])
	.controller("ModalAlertController", ModalAlertController)
	.controller("ModalConfirmerController", ModalConfirmerController)
	.name;