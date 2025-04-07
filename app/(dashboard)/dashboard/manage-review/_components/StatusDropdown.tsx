'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { ReviewStatus } from '../_types';

interface StatusDropdownProps {
  currentStatus: ReviewStatus;
  onStatusChange: (status: ReviewStatus) => void;
}

export function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
  const statuses: ReviewStatus[] = ['Pending', 'Cancelled', 'Accepted'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          <ReviewStatusBadge status={currentStatus} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {statuses.map((status) => (
          <DropdownMenuItem 
            key={status} 
            onClick={() => onStatusChange(status)}
            className="cursor-pointer"
          >
            <ReviewStatusBadge status={status} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}