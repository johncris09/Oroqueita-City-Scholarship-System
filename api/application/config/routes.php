<?php
defined('BASEPATH') or exit('No direct script access allowed');

$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
$route['api/demo'] = 'api/ApiDemoController/index';


$route['login'] = 'User/login';

// Search
// $route['search'] = 'Search'; 
$route['search/find'] = 'Search/find';

// Senior High
$route['senior_high'] = 'SeniorHigh';
$route['senior_high/bulk_approved'] = 'SeniorHigh/bulk_approved';
$route['senior_high/bulk_disapproved'] = 'SeniorHigh/bulk_disapproved';
$route['senior_high/filter_pending'] = 'SeniorHigh/filter_pending';
$route['senior_high/filter_approved'] = 'SeniorHigh/filter_approved';
$route['senior_high/total_status'] = 'SeniorHigh/total_status';
$route['senior_high/filter_total_status'] = 'SeniorHigh/filter_total_status';
$route['senior_high/all_total_status'] = 'SeniorHigh/all_total_status';
$route['senior_high/pending'] = 'SeniorHigh/pending';
$route['senior_high/all_pending'] = 'SeniorHigh/all_pending';
$route['senior_high/approved'] = 'SeniorHigh/approved';
$route['senior_high/all_approved'] = 'SeniorHigh/all_approved';
$route['senior_high/total'] = 'SeniorHigh/total';
$route['senior_high/filter_total'] = 'SeniorHigh/filter_total';
$route['senior_high/all_total'] = 'SeniorHigh/all_total';
$route['senior_high/disapproved'] = 'SeniorHigh/disapproved';
$route['senior_high/all_disapproved'] = 'SeniorHigh/all_disapproved';
$route['senior_high/filter_disapproved'] = 'SeniorHigh/filter_disapproved';
$route['senior_high/archived'] = 'SeniorHigh/archived';
$route['senior_high/filter_archived'] = 'SeniorHigh/filter_archived';
$route['senior_high/all_archived'] = 'SeniorHigh/all_archived';
$route['senior_high/void'] = 'SeniorHigh/void';
$route['senior_high/filter_void'] = 'SeniorHigh/filter_void';
$route['senior_high/all_void'] = 'SeniorHigh/all_void';


// College
$route['college'] = 'College';
$route['college/bulk_approved'] = 'College/bulk_approved';
$route['college/bulk_disapproved'] = 'College/bulk_disapproved';
$route['college/filter_pending'] = 'College/filter_pending';
$route['college/filter_approved'] = 'College/filter_approved';
$route['college/total_status'] = 'College/total_status';
$route['college/filter_total_status'] = 'College/filter_total_status';
$route['college/all_total_status'] = 'College/all_total_status';
$route['college/pending'] = 'College/pending';
$route['college/all_pending'] = 'College/all_pending';
$route['college/approved'] = 'College/approved';
$route['college/all_approved'] = 'College/all_approved';
$route['college/archived'] = 'College/archived';
$route['college/total'] = 'College/total';
$route['college/filter_total'] = 'College/filter_total';
$route['college/all_total'] = 'College/all_total';
$route['college/disapproved'] = 'College/disapproved';
$route['college/all_disapproved'] = 'College/all_disapproved';
$route['college/filter_disapproved'] = 'College/filter_disapproved';
$route['college/archived'] = 'College/archived';
$route['college/filter_archived'] = 'College/filter_archived';
$route['college/all_archived'] = 'College/all_archived';
$route['college/void'] = 'College/void';
$route['college/filter_void'] = 'College/filter_void';
$route['college/all_void'] = 'College/all_void';


// Tvet
$route['tvet'] = 'Tvet';
$route['tvet/bulk_approved'] = 'Tvet/bulk_approved';
$route['tvet/bulk_disapproved'] = 'Tvet/bulk_disapproved';
$route['tvet/filter_pending'] = 'Tvet/filter_pending';
$route['tvet/filter_approved'] = 'Tvet/filter_approved';
$route['tvet/total_status'] = 'Tvet/total_status';
$route['tvet/filter_total_status'] = 'Tvet/filter_total_status';
$route['tvet/all_total_status'] = 'Tvet/all_total_status';
$route['tvet/pending'] = 'Tvet/pending';
$route['tvet/all_pending'] = 'Tvet/all_pending';
$route['tvet/approved'] = 'Tvet/approved';
$route['tvet/all_approved'] = 'Tvet/all_approved';
$route['tvet/archived'] = 'Tvet/archived';
$route['tvet/total'] = 'Tvet/total';
$route['tvet/filter_total'] = 'Tvet/filter_total';
$route['tvet/all_total'] = 'Tvet/all_total';
$route['tvet/disapproved'] = 'Tvet/disapproved';
$route['tvet/all_disapproved'] = 'Tvet/all_disapproved';
$route['tvet/filter_disapproved'] = 'Tvet/filter_disapproved';
$route['tvet/archived'] = 'Tvet/archived';
$route['tvet/filter_archived'] = 'Tvet/filter_archived';
$route['tvet/all_archived'] = 'Tvet/all_archived';
$route['tvet/void'] = 'Tvet/void';
$route['tvet/filter_void'] = 'Tvet/filter_void';
$route['tvet/all_void'] = 'Tvet/all_void';


// Senior High School 
$route['senior_high_school'] = 'SeniorHighSchool';
$route['senior_high_school/get_all'] = 'SeniorHighSchool/get_all';
$route['senior_high_school/insert'] = 'SeniorHighSchool/insert';
$route['senior_high_school/find/(:any)'] = 'SeniorHighSchool/find/$1';
$route['senior_high_school/update/(:any)'] = 'SeniorHighSchool/update/$1';
$route['senior_high_school/delete/(:any)'] = 'SeniorHighSchool/delete/$1';
$route['senior_high_school/bulk_delete'] = 'SeniorHighSchool/bulk_delete';

// College School
$route['college_school'] = 'CollegeSchool';
$route['college_school/get_all'] = 'CollegeSchool/get_all';
$route['college_school/insert'] = 'CollegeSchool/insert';
$route['college_school/find/(:any)'] = 'CollegeSchool/find/$1';
$route['college_school/update/(:any)'] = 'CollegeSchool/update/$1';
$route['college_school/delete/(:any)'] = 'CollegeSchool/delete/$1';
$route['college_school/bulk_delete'] = 'CollegeSchool/bulk_delete';

// Strand
$route['strand/get_all'] = 'Strand/get_all';
$route['strand/insert'] = 'Strand/insert';
$route['strand/find/(:any)'] = 'Strand/find/$1';
$route['strand/update/(:any)'] = 'Strand/update/$1';
$route['strand/delete/(:any)'] = 'Strand/delete/$1';
$route['strand/bulk_delete/'] = 'Strand/bulk_delete/';

// Course
$route['course/get_all'] = 'Course/get_all';
$route['course/insert'] = 'Course/insert';
$route['course/find/(:any)'] = 'Course/find/$1';
$route['course/update/(:any)'] = 'Course/update/$1';
$route['course/delete/(:any)'] = 'Course/delete/$1';
$route['course/bulk_delete/'] = 'Course/bulk_delete/';



// Test
$route['test/get_all'] = 'Test/get_all';
$route['test/insert'] = 'Test/insert';
$route['test/find/(:any)'] = 'Test/find/$1';
$route['test/update/(:any)'] = 'Test/update/$1';
$route['test/delete/(:any)'] = 'Test/delete/$1';
$route['test/bulk_delete/'] = 'Test/bulk_delete/';