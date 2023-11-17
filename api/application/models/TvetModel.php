<?php

defined('BASEPATH') or exit('No direct script access allowed');

class TvetModel extends CI_Model
{

	public $table = 'table_tvet';


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
		$query = $this->db->select(
			'ID,
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
			colUnits'
		)
			->order_by('ID', 'desc')
			->get($this->table, 100);
		return $query->result();
	}

	public function pending()
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select(
			'ID,
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
			colUnits'
		)
			->where('colAppStat', 'pending')
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->order_by('ID', 'desc')
			->get($this->table);
		return $query->result();
	}



	public function all_pending()
	{
 
		$query = $this->db->select(
			'ID,
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
			colUnits'
		)
			->where('colAppStat', 'pending') 
			->order_by('ID', 'desc')
			->get($this->table);
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

    public function filter_total_pending($data)
    {  
        $query = $this->db->select('count(*) as total_pending')
		->where('colAppStat', 'pending')
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





	public function filter_pending($data)
	{

		$query = $this->db->select(
			'ID,
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
			colUnits'
		)
			->where('colAppStat', 'pending')
			->where($data)
			->order_by('ID', 'desc')
			->get($this->table);
		return $query->result();
	}

	public function approved()
	{ 
		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];


		$query = $this->db->select(
			'ID,
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
			colUnits'
		)
			->like('colAppStat', 'approved', 'both')
			->where('colAppStat !=', 'disapproved')
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->where('colManager', 'Active')
			->order_by('id', 'desc')
			->get($this->table);
		return $query->result();
	}


	public function all_approved()
	{  

		$query = $this->db->select(
			'ID,
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
			colUnits'
		)
			->like('colAppStat', 'approved', 'both')
			->where('colAppStat !=', 'disapproved') 
			->where('colManager', 'Active')
			->order_by('id', 'desc')
			->get($this->table);
		return $query->result();
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




    public function total_disapproved()
    {

        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0]; 

        $query = $this->db->select('count(*) as total_disapproved') 
		->where('colAppStat  ', 'disapproved')
		->where('colSem', $query_sem->current_semester)
		->where('colSY', $query_sy->current_sy)
		->where('colManager', 'Active')
            ->get($this->table);
 
        return $query->result()[0];
    }

    public function filter_total_disapproved($data)
    {
 
        $query = $this->db->select('count(*) as total_disapproved') 
		->where('colAppStat  ', 'disapproved') 
		->where($data)
		->where('colManager', 'Active')
            ->get($this->table);
 
        return $query->result()[0];
    }
    public function all_total_disapproved()
    {
 
        $query = $this->db->select('count(*) as total_disapproved') 
		->where('colAppStat  ', 'disapproved')  
		->where('colManager', 'Active')
            ->get($this->table);
 
        return $query->result()[0];
    }


	public function filter_approved($data)
	{



		$query = $this->db->select(
			'ID,
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
			colUnits'
		)
			->like('colAppStat', 'approved', 'both')
			->where('colAppStat !=', 'disapproved')
			->where($data)
			->where('colManager', 'Active')
			->order_by('id', 'desc')
			->get($this->table);
		return $query->result();
	}




	public function archived()
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];


		$query = $this->db->select(
			'ID,
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
			colUnits'
		)
			->where('colAppStat', 'archived')
			->where('colSem', $query_sem->current_semester)
			->where('colSY', $query_sy->current_sy)
			->where('colManager', 'Active')
			->order_by('id', 'desc')
			->get($this->table);
		return $query->result();
	}




	public function bulk_approved($status, $id)
	{
		return [$status, $id];
		// $this->db->where('id', $id);
		// return $this->db->update($this->table, ['colAppStat' => $status]);

	}

	public function bulk_disapproved($id)
	{
		return ['Disapproved', $id];
		// $this->db->where('id', $id);
		// return $this->db->update($this->table, ['colAppStat' => 'Disapproved']);

	}

}