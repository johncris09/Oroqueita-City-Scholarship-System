<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class SystemSequence extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SystemSequenceModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$system_sequence = new SystemSequenceModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($system_sequence->get_all()));
		$this->response($result, RestController::HTTP_OK);
	}
	public function shs_appno_get()
	{
		$system_sequence = new SystemSequenceModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($system_sequence->shs_appno()));
		$result = $system_sequence->shs_appno();
		$this->response($result, RestController::HTTP_OK);
	}

	public function college_appno_get()
	{
		$system_sequence = new SystemSequenceModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($system_sequence->college_appno()));
		$result = $system_sequence->college_appno();
		$this->response($result, RestController::HTTP_OK);
	}


	public function tvet_appno_get()
	{
		$system_sequence = new SystemSequenceModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($system_sequence->tvet_appno()));
		$result = $system_sequence->tvet_appno();
		$this->response($result, RestController::HTTP_OK);
	}



}