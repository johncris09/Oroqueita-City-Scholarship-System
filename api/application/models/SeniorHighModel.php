<?php

defined('BASEPATH') or exit('No direct script access allowed');

class SeniorHighModel extends CI_Model
{

    public $table = 'table_scholarregistration';

    public $default_column = '
        ID,
        AppNoYear,
        AppNoID,
        AppNoSem,
        AppStatus,
        AppFirstName,
        AppMidIn,
        AppLastName,
        AppSuffix,
        AppAddress,
        AppDOB,
        AppAge,
        AppCivilStat,
        AppGender,
        AppContact,
        AppCTC,
        AppEmailAdd,
        AppAvailment,
        AppSchool,
        AppCourse,
        AppSchoolAddress,
        AppYear,
        AppSem,
        AppSY,
        AppFather,
        AppFatherOccu,
        AppMother,
        AppMotherOccu,
        AppManager
    ';


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
    

    
    public function total()
    {

        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $query = $this->db->select('count(*) as total')
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->where('AppManager', 'Active')
            ->get($this->table);

        $result = $query->row();
        return $result->total;

    }


    public function filter_total($data)
    {
        $query = $this->db->select('count(*) as total')
            ->where($data)
            ->where('AppManager', 'Active')
            ->get($this->table);

        $result = $query->row();
        return $result->total;
    }


    public function all_total()
    {
        $query = $this->db->select('count(*) as total')
            ->where('AppManager', 'Active')
            ->get($this->table);

        $result = $query->row();
        return $result->total;
    }

    public function get_student()
    {
        $query = $this->db->select($this->default_column)
            ->where('AppManager', 'Active')
            ->order_by('id', 'desc')
            ->get($this->table);
        return $query->result();
    }


    public function get_by_status($data)
    {
        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->row();
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->row();

        $this->db->select($this->default_column)
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->order_by('id', 'desc');

        if ($data['AppStatus'] == 'approved') {
            $this->db->like('AppStatus', 'approved', 'both')
                ->where('AppStatus !=', 'disapproved');
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

        if ($data['AppStatus'] == 'approved') {
            $this->db->where($data)
                ->like('AppStatus', 'approved', 'both')
                ->where('AppStatus !=', 'disapproved');
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
            ->where('AppStatus', 'pending')
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }





    public function filter_total_pending($data)
    {
        $query = $this->db->select('count(*) as total_pending')
            ->where('AppStatus', 'pending')
            ->where($data)
            ->where('AppManager', 'Active')
            ->get($this->table);
        return $query->result()[0];
    }



    public function all_total_pending()
    {
        $query = $this->db->select('count(*) as total_pending')
            ->where('AppStatus', 'pending')
            ->where('AppManager', 'Active')
            ->get($this->table);
        return $query->result()[0];
    }



    public function total_approved()
    {


        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $query = $this->db->select('count(*) as total_approved')
            ->like('AppStatus', 'approved', 'both')
            ->where('AppStatus !=', 'disapproved')
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }



    public function filter_total_approved($data)
    {


        $query = $this->db->select('count(*) as total_approved')
            ->like('AppStatus', 'approved', 'both')
            ->where('AppStatus !=', 'disapproved')
            ->where($data)
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }



    public function all_total_approved()
    {


        $query = $this->db->select('count(*) as total_approved')
            ->like('AppStatus', 'approved', 'both')
            ->where('AppStatus !=', 'disapproved')
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }


    public function total_disapproved()
    {


        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $query = $this->db->select('count(*) as total_disapproved')
            ->where('AppStatus ', 'disapproved')
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }




    public function total_archived()
    {


        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $query = $this->db->select('count(*) as total_archived')
            ->where('AppStatus ', 'archived')
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }


    public function total_void()
    {

        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $query = $this->db->select('count(*) as total_void')
            ->where('AppStatus ', 'void')
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }


    public function filter_total_disapproved($data)
    {


        $query = $this->db->select('count(*) as total_disapproved')
            ->where('AppStatus ', 'disapproved')
            ->where($data)
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }
    public function filter_total_archived($data)
    {


        $query = $this->db->select('count(*) as total_archived')
            ->where('AppStatus ', 'archived')
            ->where($data)
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }
    public function filter_total_void($data)
    {

        $query = $this->db->select('count(*) as total_void')
            ->where('AppStatus ', 'void')
            ->where($data)
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }
    public function all_total_disapproved()
    {


        $query = $this->db->select('count(*) as total_disapproved')
            ->where('AppStatus ', 'disapproved')
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }

    public function all_total_archived()
    {


        $query = $this->db->select('count(*) as total_archived')
            ->where('AppStatus ', 'archived')
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }
    public function all_total_void()
    {


        $query = $this->db->select('count(*) as total_void')
            ->where('AppStatus ', 'void')
            ->where('AppManager', 'Active')
            ->get($this->table);

        return $query->result()[0];
    }


    public function bulk_status_update($status, $id)
    {
        $this->db->where_in('id', $id);
        return $this->db->update($this->table, ['AppStatus' => $status]);

    }
 

}