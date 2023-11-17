<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class SeniorHighSchool extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SeniorHighSchoolModel');
	}
	public function index_get()
	{
		$school = new SeniorHighSchoolModel;
		$result = $school->get_active_school();
		$this->response($result, RestController::HTTP_OK);
	}

	public function get_all_get()
	{
		$school = new SeniorHighSchoolModel;
		$result = $school->get_all_school();
		$this->response($result, RestController::HTTP_OK);
	}
	public function insert_post()
	{

		$school = new SeniorHighSchoolModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
  
		$data = array(
			'SchoolName' => $requestData['school_name'],
			'address' => $requestData['address'],
			'Manager' => $requestData['manager'],

		);

		$result = $school->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Senior High School Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create senior high school.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$school = new SeniorHighSchoolModel;
		$result = $school->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$school = new SeniorHighSchoolModel;

		$requestData = json_decode($this->input->raw_input_stream, true);
	  
		$data = array(
			'SchoolName' => $requestData['school_name'],
			'address' => $requestData['address'],
			'Manager' => $requestData['manager'], 
		);
		 

		$update_result = $school->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Senior High School Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update senior high school.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$school = new SeniorHighSchoolModel;
		$result = $school->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Senior High School Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete senior high school.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function bulk_delete_delete()
	{

		$school = new SeniorHighSchoolModel;
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
				'message' => 'Senior High School Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete senior high school.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}

}