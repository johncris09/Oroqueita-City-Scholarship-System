<?php
defined('BASEPATH') or exit('No direct script access allowed');

$route['default_controller']   = 'welcome';
$route['404_override']         = '';
$route['translate_uri_dashes'] = FALSE;
$route['api/demo']             = 'api/ApiDemoController/index';


$route['login'] = 'User/login';

  // Search
  // $route['search'] = 'Search'; 
$route['search/find'] = 'Search/find';

  // Senior High
$route['senior_high']                           = 'SeniorHigh';
$route['senior_high/find/(:any)']               = 'SeniorHigh/find/$1';
$route['senior_high/insert']                    = 'SeniorHigh/insert';
$route['senior_high/update/(:any)']             = 'SeniorHigh/update/$1';
$route['senior_high/update_status/(:any)']      = 'SeniorHigh/update_status/$1';
$route['senior_high/bulk_status_update']        = 'SeniorHigh/bulk_status_update';
$route['senior_high/filter_approved']           = 'SeniorHigh/filter_approved';
$route['senior_high/total_status']              = 'SeniorHigh/total_status';
$route['senior_high/filter_total_status']       = 'SeniorHigh/filter_total_status';
$route['senior_high/all_total_status']          = 'SeniorHigh/all_total_status';
$route['senior_high/total']                     = 'SeniorHigh/total';
$route['senior_high/filter_total']              = 'SeniorHigh/filter_total';
$route['senior_high/all_total']                 = 'SeniorHigh/all_total';
$route['senior_high/get_by_status']             = 'SeniorHigh/get_by_status';
$route['senior_high/filter_by_status']          = 'SeniorHigh/filter_by_status';
$route['senior_high/get_all_by_status']         = 'SeniorHigh/get_all_by_status';
$route['senior_high/get_status_by_barangay']    = 'SeniorHigh/get_status_by_barangay';
$route['senior_high/all_status_by_barangay']    = 'SeniorHigh/all_status_by_barangay';
$route['senior_high/filter_status_by_barangay'] = 'SeniorHigh/filter_status_by_barangay';


  // College
$route['college']                           = 'College';
$route['college/find/(:any)']               = 'College/find/$1';
$route['college/insert']                    = 'College/insert';
$route['college/update/(:any)']             = 'College/update/$1';
$route['college/update_status/(:any)']      = 'College/update_status/$1';
$route['college/bulk_status_update']        = 'College/bulk_status_update';
$route['college/filter_approved']           = 'College/filter_approved';
$route['college/total_status']              = 'College/total_status';
$route['college/filter_total_status']       = 'College/filter_total_status';
$route['college/all_total_status']          = 'College/all_total_status';
$route['college/total']                     = 'College/total';
$route['college/filter_total']              = 'College/filter_total';
$route['college/all_total']                 = 'College/all_total';
$route['college/get_by_status']             = 'College/get_by_status';
$route['college/filter_by_status']          = 'College/filter_by_status';
$route['college/get_all_by_status']         = 'College/get_all_by_status';
$route['college/get_status_by_barangay']    = 'College/get_status_by_barangay';
$route['college/all_status_by_barangay']    = 'College/all_status_by_barangay';
$route['college/filter_status_by_barangay'] = 'College/filter_status_by_barangay';


  // Tvet
$route['tvet']                           = 'Tvet';
$route['tvet/insert']                    = 'Tvet/insert';
$route['tvet/find/(:any)']               = 'Tvet/find/$1';
$route['tvet/insert']                    = 'Tvet/insert';
$route['tvet/update/(:any)']             = 'Tvet/update/$1';
$route['tvet/update_status/(:any)']      = 'Tvet/update_status/$1';
$route['tvet/bulk_status_update']        = 'Tvet/bulk_status_update';
$route['tvet/filter_approved']           = 'Tvet/filter_approved';
$route['tvet/total_status']              = 'Tvet/total_status';
$route['tvet/filter_total_status']       = 'Tvet/filter_total_status';
$route['tvet/all_total_status']          = 'Tvet/all_total_status';
$route['tvet/total']                     = 'Tvet/total';
$route['tvet/filter_total']              = 'Tvet/filter_total';
$route['tvet/all_total']                 = 'Tvet/all_total';
$route['tvet/get_by_status']             = 'Tvet/get_by_status';
$route['tvet/filter_by_status']          = 'Tvet/filter_by_status';
$route['tvet/get_all_by_status']         = 'Tvet/get_all_by_status';
$route['tvet/get_status_by_barangay']    = 'Tvet/get_status_by_barangay';
$route['tvet/all_status_by_barangay']    = 'Tvet/all_status_by_barangay';
$route['tvet/filter_status_by_barangay'] = 'Tvet/filter_status_by_barangay';


  // Senior High School 
$route['senior_high_school']               = 'SeniorHighSchool';
$route['senior_high_school/get_all']       = 'SeniorHighSchool/get_all';
$route['senior_high_school/insert']        = 'SeniorHighSchool/insert';
$route['senior_high_school/find/(:any)']   = 'SeniorHighSchool/find/$1';
$route['senior_high_school/update/(:any)'] = 'SeniorHighSchool/update/$1';
$route['senior_high_school/delete/(:any)'] = 'SeniorHighSchool/delete/$1';
$route['senior_high_school/bulk_delete']   = 'SeniorHighSchool/bulk_delete';

  // College School
$route['college_school']               = 'CollegeSchool';
$route['college_school/get_all']       = 'CollegeSchool/get_all';
$route['college_school/insert']        = 'CollegeSchool/insert';
$route['college_school/find/(:any)']   = 'CollegeSchool/find/$1';
$route['college_school/update/(:any)'] = 'CollegeSchool/update/$1';
$route['college_school/delete/(:any)'] = 'CollegeSchool/delete/$1';
$route['college_school/bulk_delete']   = 'CollegeSchool/bulk_delete';

  // Strand
$route['strand/get_all']       = 'Strand/get_all';
$route['strand/insert']        = 'Strand/insert';
$route['strand/find/(:any)']   = 'Strand/find/$1';
$route['strand/update/(:any)'] = 'Strand/update/$1';
$route['strand/delete/(:any)'] = 'Strand/delete/$1';
$route['strand/bulk_delete/']  = 'Strand/bulk_delete/';

  // Course
$route['course/get_all']       = 'Course/get_all';
$route['course/insert']        = 'Course/insert';
$route['course/find/(:any)']   = 'Course/find/$1';
$route['course/update/(:any)'] = 'Course/update/$1';
$route['course/delete/(:any)'] = 'Course/delete/$1';
$route['course/bulk_delete/']  = 'Course/bulk_delete/';



  // Course
$route['system_sequence']               = 'SystemSequence/index';
$route['system_sequence/shs_appno']     = 'SystemSequence/shs_appno';
$route['system_sequence/college_appno'] = 'SystemSequence/college_appno';
$route['system_sequence/tvet_appno']    = 'SystemSequence/tvet_appno';


  // Test
$route['test/get_all']       = 'Test/get_all';
$route['test/insert']        = 'Test/insert';
$route['test/find/(:any)']   = 'Test/find/$1';
$route['test/update/(:any)'] = 'Test/update/$1';
$route['test/delete/(:any)'] = 'Test/delete/$1';
$route['test/bulk_delete/']  = 'Test/bulk_delete/';