<?php
namespace App\Controllers;
require_once __DIR__ . '/../../config/Database.php';

date_default_timezone_set('Asia/Manila');

header('Content-Type: application/json');

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Constants\Action;
use App\Models\AllowanceCycleModel;
use App\Models\ApplicantModel;
use App\Models\AuditLogModel;
use App\Models\RenderedHoursHistoryModel;
use App\Models\ScholarAccountInformationModel;
use App\Models\ScholarsModel;
use App\Models\SchoolYearModel;
use App\Models\StaffAccountModel;
use App\Services\AllowanceService;
use Config\Database;
use DateTime;
use App\Middleware\Auth;

class ScholarsController
{
    private $pdo;
    private $currentYear;
    private $auditLogModel;
    private $staffModel;

    public function __construct()
    {
        $db = new Database();
        $this->pdo = $db->getConnection();
        $this->currentYear = date('Y');
        $this->auditLogModel = new AuditLogModel();
        $this->staffModel = new StaffAccountModel();
    }

    public function processRequest()
    {
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            http_response_code(200);
            return;
        }

        $requestMethod = $_SERVER['REQUEST_METHOD'];

        switch ($requestMethod) {
            case 'GET':
                $this->handleGet();
                break;

            case 'PUT':
                $this->handlePut();
                break;

            default:
                http_response_code(405);
                echo json_encode(['message' => 'Method not allowed']);
                break;
        }
    }

    private function handleGet()
    {
        try {
            $scholar = new ScholarsModel();
            $service = new AllowanceService();
            $cycleModel = new AllowanceCycleModel();
            $schoolYearModel = new SchoolYearModel();
            $info = new ScholarAccountInformationModel();

            // Get ID parameter if it exists
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            $tab = $_GET['tab'] ?? null;
            $status = $_GET['status'] ?? null;
            $school_year = $_GET['school_year'] ?? null;
            $school = $_GET['school'] ?? null;
            $course = $_GET['course'] ?? null;
            $year_level = $_GET['year_level'] ?? null;
            $filter = $_GET['filter'] ?? null;
            $sort = $_GET['sort'] ?? null;

            $results = [];
            $scholars = [];
            $data = [];

            if ($tab === 'all') {
                $results = $scholar->getAllScholars($status, $school_year, $sort);
            } elseif ($tab === 'active') {
                $scholarIds = $scholar->getAllScholarsId();
                $isProcessed = $cycleModel->isPreviousMonthProcessed();

                if (!$isProcessed) {
                    foreach ($scholarIds as $scholarId) {
                        $renderedHours = $scholar->getScholarRenderedHours(
                            $scholarId['account_id'],
                        );
                        [$allowance, $newRenderedHours] = $service->calculate($renderedHours);
                        $scholar->unProcessScholarsAllowance($scholarId['account_id'], $allowance);
                    }
                }

                $activeSchoolYear = $schoolYearModel->getActiveSchoolYear();
                $newScholars = [];
                $oldScholars = [];

                // if ($status === 'all') {
                //     $newScholars = $scholar->getNewActiveScholars(
                //         $status,
                //         $activeSchoolYear,
                //         $school,
                //         $year_level,
                //         $course,
                //     );

                //     $oldScholars = $scholar->getOldActiveScholars(
                //         $status,
                //         $activeSchoolYear,
                //         $school,
                //         $year_level,
                //         $course,
                //     );
                // } elseif ($status === 'new') {
                //     $newScholars = $scholar->getNewActiveScholars(
                //         $status,
                //         $activeSchoolYear,
                //         $school,
                //         $year_level,
                //         $course,
                //     );
                // } elseif ($status === 'old') {
                //     $oldScholars = $scholar->getOldActiveScholars(
                //         $status,
                //         $activeSchoolYear,
                //         $school,
                //         $year_level,
                //         $course,
                //     );
                // }

                // $scholars = [...$newScholars, ...$oldScholars];

                $scholars = $scholar->getActiveScholars(
                    $status,
                    $activeSchoolYear,
                    $school,
                    $year_level,
                    $course,
                    $sort,
                    $filter,
                );
            } elseif ($tab === 'graduated') {
                $scholars = $scholar->getGraduatedScholars($status, $school_year, $school, $course);
            } elseif ($tab === 'terminated') {
                $scholars = $scholar->getTerminatedScholars(
                    $status,
                    $school_year,
                    $school,
                    $course,
                );
            } elseif ($tab === 'not_renewed') {
                $scholars = $scholar->getNotRenewedScholars(
                    $status,
                    $school_year,
                    $school,
                    $course,
                );
            }

            foreach ($scholars as $s) {
                $basicInfo = $info->getBasicInformation($s['account_id']);
                $academicInfo = $info->getAcademicInfo($s['account_id']);
                $transportDetails = $info->getTransportDetails($s['account_id']);
                $scholarStatus = $info->getScholarStatus($s['account_id']);
                $renderedHours = $info->getRenderedHours($s['account_id']);

                $s[] = [
                    'basic_information' => $basicInfo,
                    'academic_information' => $academicInfo,
                    'transport_details' => $transportDetails,
                    'scholar_status' => $scholarStatus,
                    'rendered_hours' => $renderedHours,
                ];

                $results[] = $s;
            }

            $data = $scholar->getScholarsWithProfile($results, $scholar, 'created');

            $cycleModel = new AllowanceCycleModel();

            $currentMonth = (int) date('n');
            if ($currentMonth >= 6) {
                $nextYear = $this->currentYear + 1;
                if (!$cycleModel->cyclesExistForYear($nextYear)) {
                    $cycleModel->createYearlyCycles($nextYear);
                }
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    private function handlePut()
    {
        try {
            $this->pdo->beginTransaction();

            $model = new ScholarsModel();
            $service = new AllowanceService();
            $allowanceCycleModel = new AllowanceCycleModel();
            $hoursModel = new RenderedHoursHistoryModel();

            // Check if there's a cycle ready to process
            if (!$allowanceCycleModel->hasCycleReadyToProcess()) {
                http_response_code(200);
                echo json_encode([
                    'success' => false,
                    'message' =>
                        'No cycle ready to process yet. Wait until cutoff date has passed.',
                ]);
                return;
            }

            $result = $allowanceCycleModel->processAllowanceCycle();

            $scholars = $model->getAllScholarsId();
            $isProcessed = $allowanceCycleModel->isPreviousMonthProcessed();

            if ($isProcessed) {
                foreach ($scholars as $scholar) {
                    $renderedHours = $model->getScholarRenderedHours($scholar['account_id']);
                    [$allowance, $newRenderedHours] = $service->calculate($renderedHours);

                    $hours = $renderedHours >= 20 ? 20 : $renderedHours;

                    $hoursModel->createHistory([
                        'account_id' => $scholar['account_id'],
                        'transaction_type' => 'deduct',
                        'event_name' =>
                            $result['allowance_month'] . ' ' . $result['year'] . ' Allowance',
                        'source_type' => 'allowance',
                        'hours' => $hours,
                    ]);

                    $model->processScholarsAllowance(
                        $scholar['account_id'],
                        $allowance,
                        $newRenderedHours,
                    );
                }
            }

            $staffId = Auth::id();
            $staff = $this->staffModel->getStaffInfoById($staffId);

            if (
                !$this->auditLogModel->create([
                    'user_id' => $staffId,
                    'actor' => "{$staff['first_name']} {$staff['last_name']}",
                    'user_role' => 'staff',
                    'action' => Action::ALLOWANCE_PROCESS,
                    'entity_type' => 'allowance',
                    'entity_id' => null,

                    'description' => "{$staff['first_name']} {$staff['last_name']} processed allowances for {$result['allowance_month']}.",

                    'old_values' => null,
                    'new_values' => ['status' => 'processed'],
                    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                ])
            ) {
                throw new \Exception('Failed to create audit log');
            }

            $this->pdo->commit();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Scholars allowance processed successfully',
            ]);
        } catch (\Exception $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}

// Create and execute controller
$controller = new ScholarsController();
$controller->processRequest();
?>
