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
		$this->load->model('SystemSequenceModel');
	}
	public function index_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->get_student()));
		$this->response($result, RestController::HTTP_OK);
	}


	public function find_get($id)
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;

		$result = $seniorhigh->find($id);

		$this->response($result, RestController::HTTP_OK);

	}



	public function update_put($id)
	{


		$seniorhigh = new SeniorHighModel;

		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'AppNoYear' => $requestData['app_no_year'],
			'AppNoSem' => $requestData['app_no_sem'],
			'AppNoID' => $requestData['app_no_id'],
			'AppStatus' => $requestData['status'],
			'AppFirstName' => $requestData['firstname'],
			'AppLastName' => $requestData['lastname'],
			'AppMidIn' => $requestData['middle_initial'],
			'AppSuffix' => $requestData['suffix'],
			'AppAddress' => $requestData['address'],
			'AppDOB' => date("m/d/Y", strtotime($requestData['birthdate'])),
			'AppAge' => $requestData['age'],
			'AppCivilStat' => $requestData['civil_status'],
			'AppGender' => $requestData['sex'],
			'AppContact' => $requestData['contact_number'],
			'AppCTC' => $requestData['ctc_number'],
			'AppEmailAdd' => $requestData['email_address'],
			'AppAvailment' => $requestData['availment'],
			'AppSchool' => $requestData['school'],
			'AppCourse' => $requestData['strand'],
			'AppSchoolAddress' => $requestData['school_address'],
			'AppYear' => $requestData['grade_level'],
			'AppSem' => $requestData['semester'],
			'AppSY' => $requestData['school_year'],
			'AppFather' => $requestData['father_name'],
			'AppFatherOccu' => $requestData['father_occupation'],
			'AppMother' => $requestData['mother_name'],
			'AppMotherOccu' => $requestData['mother_occupation'],
			// 'AppManager' => $requestData['manager'],
		);


		$update_result = $seniorhigh->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Application Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update application.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function update_status_put($id)
	{
		$seniorhigh = new SeniorHighModel;

		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'AppStatus' => $requestData['status'],
		);

		$update_result = $seniorhigh->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Application Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update application.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function insert_post()
	{

		$seniorhigh = new SeniorHighModel;
		$system_sequence = new SystemSequenceModel;


		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'AppNoYear' => $requestData['app_no_year'],
			'AppNoSem' => $requestData['app_no_sem'],
			'AppNoID' => $requestData['app_no_id'],
			'AppStatus' => 'Pending',
			'AppFirstName' => $requestData['firstname'],
			'AppLastName' => $requestData['lastname'],
			'AppMidIn' => $requestData['middle_initial'],
			'AppSuffix' => $requestData['suffix'],
			'AppAddress' => $requestData['address'],
			'AppDOB' => date("m/d/Y", strtotime($requestData['birthdate'])),
			'AppAge' => $requestData['age'],
			'AppCivilStat' => $requestData['civil_status'],
			'AppGender' => $requestData['sex'],
			'AppContact' => $requestData['contact_number'],
			'AppCTC' => $requestData['ctc_number'],
			'AppEmailAdd' => $requestData['email_address'],
			'AppAvailment' => $requestData['availment'],
			'AppSchool' => $requestData['school'],
			'AppCourse' => $requestData['strand'],
			'AppSchoolAddress' => $requestData['school_address'],
			'AppYear' => $requestData['grade_level'],
			'AppSem' => $requestData['semester'],
			'AppSY' => $requestData['school_year'],
			'AppFather' => $requestData['father_name'],
			'AppFatherOccu' => $requestData['father_occupation'],
			'AppMother' => $requestData['mother_name'],
			'AppMotherOccu' => $requestData['mother_occupation'],
			'AppManager' => 'Active',
		);



		$result = $seniorhigh->insert($data);

		if ($result > 0) {

			// update the system app no
			$appno_data = array(
				'seq_appno' => $requestData['app_no_id'],
			);
			$system_sequence->update(1, $appno_data);

			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new data.'
			], RestController::HTTP_BAD_REQUEST);
		}
	}



	public function bulk_insert_post()
	{

		$seniorhigh = new SeniorHighModel;
		$system_sequence = new SystemSequenceModel;


		$requestData = json_decode($this->input->raw_input_stream, true);

		$result = $seniorhigh->bulk_insert($requestData);


		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create new data.'
			], RestController::HTTP_BAD_REQUEST);
		}
	}



	public function get_by_status_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$data = array(
			'AppStatus' => $this->input->get('status'),
		);
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->get_by_status($data))); // current status list 
		$this->response($result, RestController::HTTP_OK);
	}


	public function filter_by_status_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$data = array(
			'AppSem' => $this->input->get('semester'),
			'AppSY' => $this->input->get('school_year'),
			'AppStatus' => $this->input->get('status'),
		);

		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->filter_by_status($data)));
		$this->response($result, RestController::HTTP_OK);
	}
	public function get_all_by_status_get()
	{

		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$data = array(
			'AppStatus' => $this->input->get('status'),
		);
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->filter_by_status($data)));
		 
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
			'archived' => (int) $seniorhigh->total_archived()->total_archived,
			'void' => (int) $seniorhigh->total_void()->total_void,
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
			'archived' => (int) $seniorhigh->filter_total_archived($data)->total_archived,
			'void' => (int) $seniorhigh->filter_total_void($data)->total_void,
		);
		$encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($encrypt, RestController::HTTP_OK);
	}


	public function all_total_status_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = array(
			'type' => "Senior High",
			'pending' => (int) $seniorhigh->all_total_pending()->total_pending,
			'approved' => (int) $seniorhigh->all_total_approved()->total_approved,
			'disapproved' => (int) $seniorhigh->all_total_disapproved()->total_disapproved,
			'archived' => (int) $seniorhigh->all_total_archived()->total_archived,
			'void' => (int) $seniorhigh->all_total_void()->total_void,
		);
		$encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($encrypt, RestController::HTTP_OK);
	}

	public function bulk_status_update_post()
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

		$result = $seniorhigh->bulk_status_update($requestData['status'], $ids);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Application Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update application.'
			], RestController::HTTP_BAD_REQUEST);

		}

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



	public function get_status_by_barangay_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$data = $seniorhigh->get_status_by_barangay();

		// Initialize arrays for labels and datasets
		$labels = array();
		$datasets = array(
			array('label' => 'Approved', 'backgroundColor' => '#0dcaf0', 'data' => array()),
			array('label' => 'Pending', 'backgroundColor' => '#ffc107', 'data' => array()),
			array('label' => 'Disapproved', 'backgroundColor' => '#f87979', 'data' => array())
		);

		// Populate labels and datasets
		foreach ($data as $item) {
			$labels[] = $item['address'];
			$datasets[0]['data'][] = $item['approved'];
			$datasets[1]['data'][] = $item['pending'];
			$datasets[2]['data'][] = $item['disapproved'];
		}

		// Assemble the final result
		$result = array(
			'labels' => $labels,
			'datasets' => $datasets
		);

		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($result, RestController::HTTP_OK);
	}



	public function all_status_by_barangay_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$data = $seniorhigh->all_status_by_barangay();

		// Initialize arrays for labels and datasets
		$labels = array();
		$datasets = array(
			array('label' => 'Approved', 'backgroundColor' => '#0dcaf0', 'data' => array()),
			array('label' => 'Pending', 'backgroundColor' => '#ffc107', 'data' => array()),
			array('label' => 'Disapproved', 'backgroundColor' => '#f87979', 'data' => array())
		);

		// Populate labels and datasets
		foreach ($data as $item) {
			$labels[] = $item['address'];
			$datasets[0]['data'][] = $item['approved'];
			$datasets[1]['data'][] = $item['pending'];
			$datasets[2]['data'][] = $item['disapproved'];
		}

		// Assemble the final result
		$result = array(
			'labels' => $labels,
			'datasets' => $datasets
		);

		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($result, RestController::HTTP_OK);
	}

	public function filter_status_by_barangay_post()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = array(
			'AppSem' => $requestData['semester'],
			'AppSY' => $requestData['school_year'],
		);
		$data = $seniorhigh->filter_status_by_barangay($data);

		// Initialize arrays for labels and datasets
		$labels = array();
		$datasets = array(
			array('label' => 'Approved', 'backgroundColor' => '#0dcaf0', 'data' => array()),
			array('label' => 'Pending', 'backgroundColor' => '#ffc107', 'data' => array()),
			array('label' => 'Disapproved', 'backgroundColor' => '#f87979', 'data' => array())
		);

		// Populate labels and datasets
		foreach ($data as $item) {
			$labels[] = $item['address'];
			$datasets[0]['data'][] = $item['approved'];
			$datasets[1]['data'][] = $item['pending'];
			$datasets[2]['data'][] = $item['disapproved'];
		}

		// Assemble the final result
		$result = array(
			'labels' => $labels,
			'datasets' => $datasets
		);

		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
		$this->response($result, RestController::HTTP_OK);
	}


	public function generate_report_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$requestData = $this->input->get();
        $data = [];

		$data = array();
		if (isset($requestData['school']) && !empty($requestData['school'])) {
			$data['Appschool'] = $requestData['school'];
		}
		if (isset($requestData['semester']) && !empty($requestData['semester'])) {
			$data['AppSem'] = $requestData['semester'];
		}
		if (isset($requestData['school_year']) && !empty($requestData['school_year'])) {
			$data['AppSY'] = $requestData['school_year'];
		}
		if (isset($requestData['status']) && !empty($requestData['status'])) {
			$data['AppStatus'] = $requestData['status'];
		}
		if (isset($requestData['availment']) && !empty($requestData['availment'])) {
			$data['AppAvailment'] = $requestData['availment'];
		}
		if (isset($requestData['sex']) && !empty($requestData['sex'])) {
			$data['AppGender'] = $requestData['sex'];
		}
		if (isset($requestData['grade_level']) && !empty($requestData['grade_level'])) {
			$data['AppYear'] = $requestData['grade_level'];
		}
		if (isset($requestData['address']) && !empty($requestData['address'])) {
			$data['AppAddress'] = $requestData['address'];
		} 

		if (isset($requestData['strand']) && !empty($requestData['strand'])) {
			$data['AppCourse'] = $requestData['strand'];
		}
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($seniorhigh->generate_report($data)));
		 
		$this->response($result, RestController::HTTP_OK);
	}
}