<?php

defined('BASEPATH') or exit('No direct script access allowed');

class SeniorHighSchoolModel extends CI_Model
{

	public $table = 'table_schoolname';

	public function get_all_school()
	{
		$query = $this->db->select('*')
			->where('SchoolName !=', '')
			->order_by('SchoolName', 'asc')
			->get($this->table);
		return $query->result();
	}


	public function get_active_school()
	{
		$query = $this->db->select('*')
			->where('Manager', 'Active')
			->where('SchoolName !=', '')
			->order_by('SchoolName', 'asc')
			->get($this->table);
		return $query->result();
	}


	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}


	public function bulk_delete($data)
	{
		$this->db->where_in('id', $data);
		return $this->db->delete($this->table);
	}


}