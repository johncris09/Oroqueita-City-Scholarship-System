<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class User extends RestController
{

  function __construct()
  {
    // Construct the parent class
    parent::__construct();
    $this->objOfJwt = new CreatorJwt();
    $this->load->model('UserModel');
  }
  public function index_get()
  {

    $this->response('Im user controller', RestController::HTTP_OK);

  }

  public function login_post()
  {

 
    try {
      $userModel = new UserModel;
      $requestData = json_decode($this->input->raw_input_stream, true);
      $userLogin = $userModel->login($requestData);


      if ($userLogin) {
        $tokenData['id'] = $userLogin->ID;
        $tokenData['exp'] = time() + 1000;
        $jwtToken = $this->objOfJwt->GenerateToken($tokenData);


        $this->response([
          'status' => true,
          'token' => $jwtToken,
          'message' => 'Login Successfully',
        ], RestController::HTTP_OK);

      } else {

        $this->response([
          'status' => false,
          'message' => 'Invalid Username/Password. Please Try Again!',
        ], RestController::HTTP_OK);
      }


    } catch (Exception $e) {
      // Handle other exceptions here


      $this->response([
        'status' => false,
        "message" => "Invalid Username/Password"
      ], 500);



    }

  }
}