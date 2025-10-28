<?php

namespace App\Services;

class AllowanceService
{
    public function calculate($renderedHours): array
    {
        $allowance = 0.0;
        $newRenderedHours = 0.0;

        if ($renderedHours >= 20) {
            $allowance = 1700;
            $newRenderedHours = $renderedHours - 20;
        } else {
            $allowance = $renderedHours * 85;
            $newRenderedHours = 0;
        }

        return [$allowance, $newRenderedHours];
    }
}

?>
