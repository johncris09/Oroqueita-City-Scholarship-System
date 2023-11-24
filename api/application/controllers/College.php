<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class College extends RestController
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->load->model('CollegeModel');
        $this->load->helper('crypto_helper');
        $this->load->model('SystemSequenceModel');
    }
    public function index_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($college->get_student()));
        $this->response($result, RestController::HTTP_OK);
    }




    public function insert_post()
    {

        $college = new CollegeModel;
        $system_sequence = new SystemSequenceModel;

        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colAppNoYear'     => $requestData['app_no_year'],
            'colAppNoSem'      => $requestData['app_no_sem'],
            'colAppNoID'       => $requestData['app_no_id'],
            'colAppStat'       => 'Pending',
            'colFirstName'     => $requestData['firstname'],
            'colLastName'      => $requestData['lastname'],
            'colMI'            => $requestData['middle_initial'],
            'colSuffix'        => $requestData['suffix'],
            'colAddress'       => $requestData['address'],
            'colDOB'           => $requestData['birthdate'],
            'colAge'           => $requestData['age'],
            'colCivilStat'     => $requestData['civil_status'],
            'colGender'        => $requestData['sex'],
            'colContactNo'     => $requestData['contact_number'],
            'colCTC'           => $requestData['ctc_number'],
            'colEmailAdd'      => $requestData['email_address'],
            'colAvailment'     => $requestData['availment'],
            'colSchool'        => $requestData['school'],
            'colCourse'        => $requestData['course'],
            'colSchoolAddress' => $requestData['school_address'],
            'colYearLevel'     => $requestData['year_level'],
            'colSem'           => $requestData['semester'],
            'colUnits'         => $requestData['units'],
            'colSY'            => $requestData['school_year'],
            'colFathersName'   => $requestData['father_name'],
            'colFatherOccu'    => $requestData['father_occupation'],
            'colMothersName'   => $requestData['mother_name'],
            'colMotherOccu'    => $requestData['mother_occupation'],
            'colManager'       => 'Active'
        );

        $result = $college->insert($data);

        if ($result > 0) {

            // update the system app no
            $appno_data = array(
                'seq_appno' => $requestData['app_no_id'],
            );
            $system_sequence->update(2, $appno_data);

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

        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $data = array(
            'colAppStat' => $this->input->get('status'),
        );
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($college->get_by_status($data))); // current status list
        $this->response($result, RestController::HTTP_OK);
    }


    public function filter_by_status_get()
    {

        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colSem' => $this->input->get('semester'),
            'colSY' => $this->input->get('school_year'),
            'colAppStat' => $this->input->get('status'),
        );

        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($college->filter_by_status($data)));
        $this->response($result, RestController::HTTP_OK);
    }
    public function get_all_by_status_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $data = array(
            'colAppStat' => $this->input->get('status'),
        );
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($college->filter_by_status($data)));
        $this->response($result, RestController::HTTP_OK);
    }


    public function total_status_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = array(
            'type' => "College",
            'pending' => (int) $college->total_pending()->total_pending,
            'approved' => (int) $college->total_approved()->total_approved,
            'disapproved' => (int) $college->total_disapproved()->total_disapproved,
            'archived' => (int) $college->total_archived()->total_archived,
            'void' => (int) $college->total_void()->total_void,
        );
        $encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
        $this->response($encrypt, RestController::HTTP_OK);
    }


    public function filter_total_status_post()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colSem' => $requestData['semester'],
            'colSY' => $requestData['school_year'],

        );

        $result = array(
            'type' => "College",
            'pending' => (int) $college->filter_total_pending($data)->total_pending,
            'approved' => (int) $college->filter_total_approved($data)->total_approved,
            'disapproved' => (int) $college->filter_total_disapproved($data)->total_disapproved,
            'archived' => (int) $college->filter_total_archived($data)->total_archived,
            'void' => (int) $college->filter_total_void($data)->total_void,
        );
        $encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
        $this->response($encrypt, RestController::HTTP_OK);
    }

    public function all_total_status_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = array(
            'type' => "College",
            'pending' => (int) $college->all_total_pending()->total_pending,
            'approved' => (int) $college->all_total_approved()->total_approved,
            'disapproved' => (int) $college->all_total_disapproved()->total_disapproved,
            'archived' => (int) $college->all_total_archived()->total_archived,
            'void' => (int) $college->all_total_void()->total_void,
        );
        $encrypt = $CryptoHelper->cryptoJsAesEncrypt(json_encode($result));
        $this->response($encrypt, RestController::HTTP_OK);
    }
    public function bulk_approved_post()
    {

        $college = new CollegeModel;
        $requestData = json_decode($this->input->raw_input_stream, true);

        // Extract IDs
        // Object to array
        $ids = array_map(function ($item) {
            return $item['ID'];
        }, $requestData['data']);

        // Convert IDs to integers
        $ids = array_map('intval', $ids);


        $result = $college->bulk_approved($requestData['status'], $ids);

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

        $college = new CollegeModel;
        $requestData = json_decode($this->input->raw_input_stream, true);

        // Extract IDs
        // Object to array
        $ids = array_map(function ($item) {
            return $item['ID'];
        }, $requestData['data']);

        // Convert IDs to integers
        $ids = array_map('intval', $ids);


        $result = $college->bulk_disapproved($ids);
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
    public function total_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode((int) $college->total()));
        $this->response($result, RestController::HTTP_OK);
    }

    public function filter_total_post()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colSem' => $requestData['semester'],
            'colSY' => $requestData['school_year'],
        );
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($college->filter_total($data)));
        $this->response($result, RestController::HTTP_OK);
    }

    public function all_total_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode((int) $college->all_total()));
        $this->response($result, RestController::HTTP_OK);
    }



}