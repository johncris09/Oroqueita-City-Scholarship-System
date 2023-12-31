<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Tvet extends RestController
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->load->model('TvetModel');
        $this->load->helper('crypto_helper');
        $this->load->model('SystemSequenceModel');
    }
    public function index_get()
    {
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($tvet->get_student()));
        $this->response($result, RestController::HTTP_OK);
    }


    public function find_get($id)
    {
        $tvet = new TvetModel;
        $result = $tvet->find($id);
        $this->response($result, RestController::HTTP_OK);

    }

    public function update_put($id)
    {

        $tvet = new TvetModel;
        $requestData = json_decode($this->input->raw_input_stream, true);

        $data = array(
            'colAppNoYear' => $requestData['app_no_year'],
            'colAppNoSem' => $requestData['app_no_sem'],
            'colAppNoID' => $requestData['app_no_id'],
            'colAppStat' => $requestData['status'],
            'colFirstName' => $requestData['firstname'],
            'colLastName' => $requestData['lastname'],
            'colMI' => $requestData['middle_initial'],
            'colSuffix' => $requestData['suffix'],
            'colAddress' => $requestData['address'],
            'colDOB' => date("m/d/Y", strtotime($requestData['birthdate'])),
            'colAge' => $requestData['age'],
            'colCivilStat' => $requestData['civil_status'],
            'colGender' => $requestData['sex'],
            'colContactNo' => $requestData['contact_number'],
            'colCTC' => $requestData['ctc_number'],
            'colEmailAdd' => $requestData['email_address'],
            'colAvailment' => $requestData['availment'],
            'colSchool' => $requestData['school'],
            'colCourse' => $requestData['course'],
            'colSchoolAddress' => $requestData['school_address'],
            'colYearLevel' => $requestData['year_level'],
            'colSem' => $requestData['semester'],
            'colUnits' => $requestData['units'],
            'colSY' => $requestData['school_year'],
            'colFathersName' => $requestData['father_name'],
            'colFatherOccu' => $requestData['father_occupation'],
            'colMothersName' => $requestData['mother_name'],
            'colMotherOccu' => $requestData['mother_occupation'],
            // 'colManager' => 'Active'
        );


        $update_result = $tvet->update($id, $data);

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
        $tvet = new TvetModel;

        $requestData = json_decode($this->input->raw_input_stream, true);


        $data = array(
            'colAppStat' => $requestData['status'],
        );

        $update_result = $tvet->update($id, $data);

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

        $tvet = new TvetModel;
        $system_sequence = new SystemSequenceModel;

        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colAppNoYear' => $requestData['app_no_year'],
            'colAppNoSem' => $requestData['app_no_sem'],
            'colAppNoID' => $requestData['app_no_id'],
            'colAppStat' => 'Pending',
            'colFirstName' => $requestData['firstname'],
            'colLastName' => $requestData['lastname'],
            'colMI' => $requestData['middle_initial'],
            'colSuffix' => $requestData['suffix'],
            'colAddress' => $requestData['address'],
            'colDOB' => date("m/d/Y", strtotime($requestData['birthdate'])),
            'colAge' => $requestData['age'],
            'colCivilStat' => $requestData['civil_status'],
            'colGender' => $requestData['sex'],
            'colContactNo' => $requestData['contact_number'],
            'colCTC' => $requestData['ctc_number'],
            'colEmailAdd' => $requestData['email_address'],
            'colAvailment' => $requestData['availment'],
            'colSchool' => $requestData['school'],
            'colCourse' => $requestData['course'],
            'colSchoolAddress' => $requestData['school_address'],
            'colYearLevel' => $requestData['year_level'],
            'colSem' => $requestData['semester'],
            'colSY' => $requestData['school_year'],
            'colFathersName' => $requestData['father_name'],
            'colFatherOccu' => $requestData['father_occupation'],
            'colMothersName' => $requestData['mother_name'],
            'colMotherOccu' => $requestData['mother_occupation'],
            'colManager' => 'Active'
        );




        $result = $tvet->insert($data);

        if ($result > 0) {

            // update the system app no
            $appno_data = array(
                'seq_appno' => $requestData['app_no_id'],
            );
            $system_sequence->update(3, $appno_data);

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

        $tvet = new TvetModel;
		$system_sequence = new SystemSequenceModel;


		$requestData = json_decode($this->input->raw_input_stream, true);

		$result = $tvet->bulk_insert($requestData);


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

        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $data = array(
            'colAppStat' => $this->input->get('status'),
        );
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($tvet->get_by_status($data))); // current status list
        $this->response($result, RestController::HTTP_OK);
    }


    public function filter_by_status_get()
    {

        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colSem' => $this->input->get('semester'),
            'colSY' => $this->input->get('school_year'),
            'colAppStat' => $this->input->get('status'),
        );

        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($tvet->filter_by_status($data)));
        $this->response($result, RestController::HTTP_OK);
    }
    public function get_all_by_status_get()
    {
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $data = array(
            'colAppStat' => $this->input->get('status'),
        );
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($tvet->filter_by_status($data)));
        $this->response($result, RestController::HTTP_OK);
    }

    public function total_status_get()
    {
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $result = array(
            'type' => "Tvet",
            'pending' => (int) $tvet->total_pending()->total_pending,
            'approved' => (int) $tvet->total_approved()->total_approved,
            'disapproved' => (int) $tvet->total_disapproved()->total_disapproved,
            'archived' => (int) $tvet->total_archived()->total_archived,
            'void' => (int) $tvet->total_void()->total_void,
        );
        $encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
        $this->response($encrypt, RestController::HTTP_OK);
    }


    public function filter_total_status_post()
    {
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colSem' => $requestData['semester'],
            'colSY' => $requestData['school_year'],

        );

        $result = array(
            'type' => "Tvet",
            'pending' => (int) $tvet->filter_total_pending($data)->total_pending,
            'approved' => (int) $tvet->filter_total_approved($data)->total_approved,
            'disapproved' => (int) $tvet->filter_total_disapproved($data)->total_disapproved,
            'archived' => (int) $tvet->filter_total_archived($data)->total_archived,
            'void' => (int) $tvet->filter_total_void($data)->total_void,
        );
        $encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
        $this->response($encrypt, RestController::HTTP_OK);
    }
    public function all_total_status_get()
    {
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $result = array(
            'type' => "Tvet",
            'pending' => (int) $tvet->all_total_pending()->total_pending,
            'approved' => (int) $tvet->all_total_approved()->total_approved,
            'disapproved' => (int) $tvet->all_total_disapproved()->total_disapproved,
            'archived' => (int) $tvet->all_total_archived()->total_archived,
            'void' => (int) $tvet->all_total_void()->total_void,
        );
        $encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
        $this->response($encrypt, RestController::HTTP_OK);
    }
    public function bulk_status_update_post()
    {

        $tvet = new TvetModel;
        $requestData = json_decode($this->input->raw_input_stream, true);

        // Extract IDs
        // Object to array
        $ids = array_map(function ($item) {
            return $item['ID'];
        }, $requestData['data']);

        // Convert IDs to integers
        $ids = array_map('intval', $ids);

        $result = $tvet->bulk_status_update($requestData['status'], $ids);

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
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode((int) $tvet->total()));
        $this->response($result, RestController::HTTP_OK);
    }

    public function filter_total_post()
    {
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colSem' => $requestData['semester'],
            'colSY' => $requestData['school_year'],
        );
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($tvet->filter_total($data)));
        $this->response($result, RestController::HTTP_OK);
    }

    public function all_total_get()
    {
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode((int) $tvet->all_total()));
        $this->response($result, RestController::HTTP_OK);
    }



    public function get_status_by_barangay_get()
    {
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $data = $tvet->get_status_by_barangay();

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
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $data = $tvet->all_status_by_barangay();

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
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colSem' => $requestData['semester'],
            'colSY' => $requestData['school_year'],
        );
        $data = $tvet->filter_status_by_barangay($data);

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
        $tvet = new TvetModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = $this->input->get();

        $data = [];
        $data = array();
        if (isset($requestData['school']) && !empty($requestData['school'])) {
            $data['colSchool'] = $requestData['school'];
        }
        if (isset($requestData['semester']) && !empty($requestData['semester'])) {
            $data['colSem'] = $requestData['semester'];
        }
        if (isset($requestData['school_year']) && !empty($requestData['school_year'])) {
            $data['colSY'] = $requestData['school_year'];
        }
        if (isset($requestData['status']) && !empty($requestData['status'])) {
            $data['colAppStat'] = $requestData['status'];
        }
        if (isset($requestData['availment']) && !empty($requestData['availment'])) {
            $data['colAvailment'] = $requestData['availment'];
        }
        if (isset($requestData['sex']) && !empty($requestData['sex'])) {
            $data['colGender'] = $requestData['sex'];
        }
        if (isset($requestData['year_level']) && !empty($requestData['year_level'])) {
            $data['colYearLevel'] = $requestData['year_level'];
        }
        if (isset($requestData['address']) && !empty($requestData['address'])) {
            $data['colAddress'] = $requestData['address'];
        }

        if (isset($requestData['course']) && !empty($requestData['course'])) {
            $data['colCourse'] = $requestData['course'];
        }
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($tvet->generate_report($data)));
        $this->response($result, RestController::HTTP_OK);
    }

}