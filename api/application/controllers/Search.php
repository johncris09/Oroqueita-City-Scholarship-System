<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Search extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SearchModel');
	} 
 


	public function find_post()
	{
		$search = new SearchModel; 
		$requestData = json_decode($this->input->raw_input_stream, true);

		$result = $search->search($requestData['query']);
		 
		  
		$this->response($result, RestController::HTTP_OK);
	} 
 

}