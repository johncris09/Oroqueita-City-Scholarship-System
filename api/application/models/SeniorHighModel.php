<?php

defined('BASEPATH') or exit('No direct script access allowed');

class SeniorHighModel extends CI_Model
{

    public $table = 'table_scholarregistration';


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
        $query = $this->db->select(
            'ID,
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
        AppManager'
        )
        ->where('AppManager', 'Active')
            ->order_by('id', 'desc')
            ->get($this->table);
        return $query->result();
    }

    public function pending()
    {


        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0]; 

        $query = $this->db->select('ID,
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
        AppManager  ')
            ->where('AppStatus', 'pending')
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->where('AppManager', 'Active')
            ->order_by('id', 'desc')
            ->get($this->table);
 
        return $query->result();
    }



    public function all_pending()
    { 
        $query = $this->db->select('ID,
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
        AppManager  ')
            ->where('AppStatus', 'pending') 
            ->where('AppManager', 'Active')
            ->order_by('id', 'desc')
            ->get($this->table);
 
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

    public function filter_pending($data)
    { 
        $query = $this->db->select('ID,
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
        AppManager  ')
            ->where('AppStatus', 'pending') 
            ->where($data) 
            ->order_by('id', 'desc')
            ->get($this->table);
 
        return $query->result();
    }



    public function all_total_pending()
    { 
        $query = $this->db->select('count(*) as total_pending')
            ->where('AppStatus', 'pending') 
            ->where('AppManager', 'Active')
            ->get($this->table); 
        return $query->result()[0];
    }

    public function approved()
    { 

        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0]; 

        $query = $this->db->select(
            'ID,
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
        AppManager'
        )
            ->like('AppStatus', 'approved', 'both')
            ->where('AppStatus !=', 'disapproved')
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->where('AppManager', 'Active')
            ->order_by('id', 'desc')
            ->get($this->table);
        return $query->result();
    }

    public function all_approved()
    { 
 
        $query = $this->db->select(
            'ID,
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
        AppManager'
        )
            ->like('AppStatus', 'approved', 'both')
            ->where('AppStatus !=', 'disapproved') 
            ->where('AppManager', 'Active')
            ->order_by('id', 'desc')
            ->get($this->table);
        return $query->result();
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
    

    public function filter_total_disapproved($data)
    {

 
        $query = $this->db->select('count(*) as total_disapproved') 
        ->where('AppStatus ', 'disapproved') 
        ->where(  $data)
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

    public function filter_approved($data)
    { 
        $query = $this->db->select(
            'ID,
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
        AppManager'
        )
            ->like('AppStatus', 'approved', 'both')
            ->where('AppStatus !=', 'disapproved')
            ->where($data) 
            ->where('AppManager', 'Active')
            ->order_by('id', 'desc')
            ->get($this->table);
        return $query->result();
    }


    public function archived()
    {


        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0]; 

        $query = $this->db->select('ID,
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
        AppManager  ')
            ->where('AppStatus', 'archived')
            ->where('AppSem', $query_sem->current_semester)
            ->where('AppSY', $query_sy->current_sy)
            ->where('AppManager', 'Active')
            ->order_by('id', 'desc')
            ->get($this->table);
        return $query->result();
    }

    public function bulk_approved($status, $id)
    {
        return [$status, $id];
        // $this->db->where('id', $id);
        // return $this->db->update($this->table, ['AppStatus' => $status]);

    }

    public function bulk_disapproved($id)
    {
        return ['Disapproved', $id];
        // $this->db->where('id', $id);
        // return $this->db->update($this->table, ['AppStatus' => 'Disapproved']);

    }


}