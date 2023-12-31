<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class CollegeSchool extends RestController
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->load->model('collegeSchoolModel');
		$this->load->helper('crypto_helper');
    }
    public function index_get()
    {
        $school = new collegeSchoolModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode( $school->get_active_school()));
         
        $this->response($result, RestController::HTTP_OK);
    } 


	public function get_all_get()
	{
		$school = new CollegeSchoolModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode( $school->get_all_school())); 
		$this->response($result, RestController::HTTP_OK);
	}
	public function insert_post()
	{

		$school = new CollegeSchoolModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
  
		$data = array(
			'colSchoolName' => $requestData['school_name'],
			'address' => $requestData['address'],
			'colManager' => $requestData['manager'],

		);

		$result = $school->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New College School Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create college school.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$school = new CollegeSchoolModel;
		$result = $school->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$school = new CollegeSchoolModel;

		$requestData = json_decode($this->input->raw_input_stream, true);
	  
		$data = array(
			'colSchoolName' => $requestData['school_name'],
			'address' => $requestData['address'],
			'colManager' => $requestData['manager'], 
		);
		 

		$update_result = $school->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'College School Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update college school.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$school = new CollegeSchoolModel;
		$result = $school->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'College School Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete college school.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function bulk_delete_delete()
	{

		$school = new CollegeSchoolModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['ID'];
		}, $requestData);

		// Convert IDs to integers
		$ids = array_map('intval', $ids); 

		$result = $school->bulk_delete($ids); 

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'College School Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete college school.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}
    
}