<?php

defined('BASEPATH') or exit('No direct script access allowed');

class SystemSequenceModel extends CI_Model
{

    public $table = 'sys_sequence';


    public function get_all()
    {
        $query = $this->db->get($this->table);
        return $query->result();
    }

    public function shs_appno()
    {
        $query = $this->db->where('Sys_ID', 1)
            ->get($this->table);
        return $query->result()[0];
    }

    public function college_appno()
    {
        $query = $this->db->where('Sys_ID', 2)
            ->get($this->table);
        return $query->result()[0];
    }

    public function tvet_appno()
    {
        $query = $this->db->where('Sys_ID', 3)
            ->get($this->table);
        return $query->result()[0];
    }



    public function update($id, $data)
	{ 
		$this->db->where('Sys_ID', $id);
		return $this->db->update($this->table, $data);
	}

}