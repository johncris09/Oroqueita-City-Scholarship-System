<?php

defined('BASEPATH') or exit('No direct script access allowed');

class UserModel extends CI_Model
{

	public $table = 'table_login';

	public function __construct()
	{
		parent::__construct();
	}

	public function login($data)
	{
		$this->db->select('*');
		$this->db->from($this->table);
		$this->db->where('username', $data['username']); // Fixed array key
		$query = $this->db->get();
		$result = $query->row();


		if ($result) {
			$providedPassword = $data['password'];

			if ($providedPassword == $result->ConfirmPassword) {
				return $result; // Passwords match
			}
		}

		return false;

	}

}