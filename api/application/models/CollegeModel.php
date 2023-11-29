<?php

defined('BASEPATH') or exit('No direct script access allowed');

class CollegeModel extends CI_Model
{

	public $table = 'table_collegeapp';
	public $default_column = '
		ID,
		colAppNoYear,
		colAppNoID,
		colAppNoSem,
		colAppStat,
		colFirstName,
		colLastName,
		colMI,
		colSuffix,
		colAddress,
		colDOB,
		colAge,
		colCivilStat,
		colGender,
		colContactNo,
		colCTC,
		colEmailAdd,
		colAvailment,
		colSchool,
		colSchoolAddress,
		colCourse,
		colYearLevel,
		colSem,
		colSY,
		colFathersName,
		colFatherOccu,
		colMothersName,
		colMotherOccu,
		colManager,
		colUnits
	';




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


	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}
	public function total()
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total')
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->where('colManager', 'Active')
			->get($this->table);

		$result = $query->row();
		return $result->total;

	}

	public function filter_total($data)
	{

		$query = $this->db->select('count(*) as total')
			->where($data)
			->where('colManager', 'Active')
			->get($this->table);

		$result = $query->row();
		return $result->total;

	}


	public function all_total()
	{

		$query = $this->db->select('count(*) as total')
			->where('colManager', 'Active')
			->get($this->table);

		$result = $query->row();
		return $result->total;

	}

	public function get_student()
	{
		$query = $this->db->select($this->default_column)
			->where('colManager', 'Active')
			->order_by('ID', 'desc')
			->get($this->table);
		return $query->result();
	}


	public function get_by_status($data)
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->row();
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->row();


		$this->db->select($this->default_column)
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->order_by('id', 'desc');

		if ($data['colAppStat'] == 'approved') {
			$this->db
				->like('colAppStat', 'approved', 'both')
				->where('colAppStat !=', 'disapproved');
		} else {
			$this->db->where($data);
		}

		$query = $this->db->get($this->table); 
		return $query->result();

	}

	public function filter_by_status($data)
	{

		$this->db->select($this->default_column)
			->order_by('id', 'desc');

		if ($data['colAppStat'] == 'approved') {
			$this->db
				->like('colAppStat', 'approved', 'both')
				->where('colAppStat !=', 'disapproved');
		} else {
			$this->db->where($data);
		}

		$query = $this->db->get($this->table);
		return $query->result();

	}


	public function total_pending()
	{
		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_pending')
			->where('colAppStat', 'pending')
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}


	public function total_disapproved()
	{
		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_disapproved')
			->where('colAppStat', 'disapproved')
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}

	public function filter_total_pending($data)
	{
		$query = $this->db->select('count(*) as total_pending')
			->where('colAppStat', 'pending')
			->where($data)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}


	public function filter_total_disapproved($data)
	{
		$query = $this->db->select('count(*) as total_disapproved')
			->where('colAppStat', 'disapproved')
			->where($data)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}

	public function all_total_pending()
	{
		$query = $this->db->select('count(*) as total_pending')
			->where('colAppStat', 'pending')
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}

	public function all_total_disapproved()
	{
		$query = $this->db->select('count(*) as total_disapproved')
			->where('colAppStat', 'pending')
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}

	public function all_total_archived()
	{
		$query = $this->db->select('count(*) as total_archived')
			->where('colAppStat', 'archived')
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}

	public function all_total_void()
	{
		$query = $this->db->select('count(*) as total_void')
			->where('colAppStat', 'void')
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}

	public function total_approved()
	{


		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_approved')
			->like('colAppStat', 'approved', 'both')
			->where('colAppStat !=', 'disapproved')
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}



	public function filter_total_approved($data)
	{
		$query = $this->db->select('count(*) as total_approved')
			->like('colAppStat', 'approved', 'both')
			->where('colAppStat !=', 'disapproved')
			->where($data)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}

	public function all_total_approved()
	{
		$query = $this->db->select('count(*) as total_approved')
			->like('colAppStat', 'approved', 'both')
			->where('colAppStat !=', 'disapproved')
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}

	public function total_archived()
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_archived')
			->where('colAppStat  ', 'archived')
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}



	public function total_void()
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_void')
			->where('colAppStat  ', 'void')
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}

	public function filter_total_archived($data)
	{

		$query = $this->db->select('count(*) as total_archived')
			->where('colAppStat  ', 'archived')
			->where($data)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}
	public function filter_total_void($data)
	{

		$query = $this->db->select('count(*) as total_void')
			->where('colAppStat  ', 'void')
			->where($data)
			->where('colManager', 'Active')
			->get($this->table);

		return $query->result()[0];
	}





	public function bulk_status_update($status, $id)
	{
		$this->db->where_in('id', $id);
		return $this->db->update($this->table, ['colAppStat' => $status]);

	}


	public function get_status_by_barangay()
	{
		$addresses = $this->config->item('address');
		$data = array();
		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		foreach ($addresses as $address) {
			$query = $this->db->select("COUNT(CASE WHEN colAppStat like '%approved%' and colAppStat != 'disapproved' AND colAddress = '$address' THEN 1 END) as approved_count", FALSE)
				->select("COUNT(CASE WHEN colAppStat = 'Pending' AND colAddress = '$address' THEN 1 END) as pending_count", FALSE)
				->select("COUNT(CASE WHEN colAppStat = 'Disapproved' AND colAddress = '$address' THEN 1 END) as disapproved_count", FALSE)
				->where('colSem', $query_sem->current_semester)
				->where('colSY', $query_sy->current_sy)
				->get($this->table);

			$result = $query->row_array();

			$data[] = array(
				'address' => $address,
				'approved' => $result['approved_count'],
				'pending' => $result['pending_count'],
				'disapproved' => $result['disapproved_count'],
			);
		}

		return $data;

	}




	public function all_status_by_barangay()
	{
		$addresses = $this->config->item('address');
		$data = array(); 
		foreach ($addresses as $address) {
			$query = $this->db->select("COUNT(CASE WHEN colAppStat like '%approved%' and colAppStat != 'disapproved' AND colAddress = '$address' THEN 1 END) as approved_count", FALSE)
				->select("COUNT(CASE WHEN colAppStat = 'Pending' AND colAddress = '$address' THEN 1 END) as pending_count", FALSE)
				->select("COUNT(CASE WHEN colAppStat = 'Disapproved' AND colAddress = '$address' THEN 1 END) as disapproved_count", FALSE)
				->get($this->table);

			$result = $query->row_array();

			$data[] = array(
				'address' => $address,
				'approved' => $result['approved_count'],
				'pending' => $result['pending_count'],
				'disapproved' => $result['disapproved_count'],
			);
		}

		return $data;

	}


    public function filter_status_by_barangay($filter_data)
    {
 
        $addresses = $this->config->item('address');
        $data = array();
        foreach ($addresses as $address) {

            $query = $this->db->select("COUNT(CASE WHEN colAppStat like '%approved%' AND colAppStat != 'disapproved' AND colAddress = '$address' THEN 1 END) as approved_count", FALSE)
                ->select("COUNT(CASE WHEN colAppStat = 'Pending' AND colAddress = '$address' THEN 1 END) as pending_count", FALSE)
                ->select("COUNT(CASE WHEN colAppStat = 'Disapproved' AND colAddress = '$address' THEN 1 END) as disapproved_count", FALSE)
                ->where($filter_data)
                ->get($this->table);

            $result = $query->row_array();

            $data[] = array(
                'address' => $address,
                'approved' => $result['approved_count'],
                'pending' => $result['pending_count'],
                'disapproved' => $result['disapproved_count'],
            );
        }

        return $data;

    }



}