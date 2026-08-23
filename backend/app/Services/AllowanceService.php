<?php

namespace App\Services;

class AllowanceService
{
    public function calculate($renderedHours, $maximumHours, $amountPerHour): array
    {
        $allowance = 0.0;
        $newRenderedHours = 0.0;

        if ($renderedHours >= $maximumHours) {
            $allowance = $maximumHours * $amountPerHour;
            $newRenderedHours = $renderedHours - $maximumHours;
        } else {
            $allowance = $renderedHours * $amountPerHour;
            $newRenderedHours = 0;
        }

        return [$allowance, $newRenderedHours];
    }
}

?>
