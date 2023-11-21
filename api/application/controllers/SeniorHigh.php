<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class SeniorHigh extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SeniorHighModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->get_student()));
		$this->response($result, RestController::HTTP_OK);
	}


	public function total_status_get()
	{
		$seniorhigh = new SeniorHighModel;
        $CryptoHelper = new CryptoHelper;
		$result = array(
			'type' => "Senior High",
			'pending' => (int) $seniorhigh->total_pending()->total_pending,
			'approved' => (int) $seniorhigh->total_approved()->total_approved,
			'disapproved' => (int) $seniorhigh->total_disapproved()->total_disapproved,
		);
        $encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($encrypt, RestController::HTTP_OK);
	}


	public function filter_total_status_post()
	{
		$seniorhigh = new SeniorHighModel;
        $CryptoHelper = new CryptoHelper;
		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = array(
			'AppSem' => $requestData['semester'],
			'AppSY' => $requestData['school_year'],

		);

		$result = array(
			'type' => "Senior High",
			'pending' => (int) $seniorhigh->filter_total_pending($data)->total_pending,
			'approved' => (int) $seniorhigh->filter_total_approved($data)->total_approved,
			'disapproved' => (int) $seniorhigh->filter_total_disapproved($data)->total_disapproved,
		);
        $encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($encrypt, RestController::HTTP_OK);
	}


	public function all_total_status_get()
	{
		$seniorhigh = new SeniorHighModel;

		$result = array(
			'type' => "Senior High",
			'pending' => (int) $seniorhigh->all_total_pending()->total_pending,
			'approved' => (int) $seniorhigh->all_total_approved()->total_approved,
			'disapproved' => (int) $seniorhigh->all_total_disapproved()->total_disapproved,
		);
		$this->response($result, RestController::HTTP_OK);
	}

	public function bulk_approved_post()
	{

		$seniorhigh = new SeniorHighModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['ID'];
		}, $requestData['data']);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);


		$result = $seniorhigh->bulk_approved($requestData['status'], $ids);

		$this->response($result, RestController::HTTP_OK);

		// if ($result > 0) {
		// 	$this->response([
		// 		'status' => true,
		// 		'message' => 'Course Deleted.'
		// 	], RestController::HTTP_OK);
		// } else {

		// 	$this->response([
		// 		'status' => false,
		// 		'message' => 'Failed to delete course.'
		// 	], RestController::HTTP_BAD_REQUEST);

		// }

	}



	public function bulk_disapproved_post()
	{

		$seniorhigh = new SeniorHighModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['ID'];
		}, $requestData['data']);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);


		$result = $seniorhigh->bulk_disapproved($ids);

		$this->response($result, RestController::HTTP_OK);

		// if ($result > 0) {
		// 	$this->response([
		// 		'status' => true,
		// 		'message' => 'Course Deleted.'
		// 	], RestController::HTTP_OK);
		// } else {

		// 	$this->response([
		// 		'status' => false,
		// 		'message' => 'Failed to delete course.'
		// 	], RestController::HTTP_BAD_REQUEST);

		// }

	}

	public function pending_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->pending())); // current pending list
		$this->response($result, RestController::HTTP_OK);

	}

	public function all_pending_get()
	{

		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->all_pending()));
		$this->response($result, RestController::HTTP_OK);
	}



	public function filter_pending_post()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = array(
			'AppSem' => $requestData['semester'],
			'AppSY' => $requestData['school_year'],

		);
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->filter_pending($data)));
		$this->response($result, RestController::HTTP_OK);
	}


	public function approved_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->approved())); // current approved list
		$this->response($result, RestController::HTTP_OK);
	}

	public function all_approved_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->all_approved()));
		$this->response($result, RestController::HTTP_OK);
	}

	public function filter_approved_post()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = array(
			'AppSem' => $requestData['semester'],
			'AppSY' => $requestData['school_year'],

		);
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->filter_approved($data)));
		$this->response($result, RestController::HTTP_OK);
	}
	public function archived_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->archived())); // current archived list
		$this->response($result, RestController::HTTP_OK);
	}
	public function total_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode((int) $seniorhigh->total()));
		$this->response($result, RestController::HTTP_OK);
	}



	public function filter_total_post()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = array(
			'AppSem' => $requestData['semester'],
			'AppSY' => $requestData['school_year'],

		);
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->filter_total($data)));
		$this->response($result, RestController::HTTP_OK);
	}


	public function all_total_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode((int) $seniorhigh->all_total()));
		$this->response($result, RestController::HTTP_OK);
	}


}