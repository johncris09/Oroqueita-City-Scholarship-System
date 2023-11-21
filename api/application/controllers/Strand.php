<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Strand extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('StrandModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$strand = new StrandModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($strand->get_active_strand()));
		$this->response($result, RestController::HTTP_OK);
	}



	public function get_all_get()
	{
		$strand = new StrandModel; 
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($strand->get_all_strand()));
		$this->response($result, RestController::HTTP_OK);
	}
	public function insert_post()
	{

		$strand = new StrandModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'Strand' => $requestData['strand'],
			'Manager' => $requestData['manager'],

		);

		$result = $strand->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Strand Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create strand.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$strand = new StrandModel;
		$result = $strand->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$strand = new StrandModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'Strand' => $requestData['strand'],
			'Manager' => $requestData['manager'],

		);

		$update_result = $strand->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Strand Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update Strand.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$strand = new StrandModel;
		$result = $strand->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Strand Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete strand.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function bulk_delete_delete()
	{

		$strand = new StrandModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['ID'];
		}, $requestData);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);

		$result = $strand->bulk_delete($ids);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Strand Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete strand.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}

}