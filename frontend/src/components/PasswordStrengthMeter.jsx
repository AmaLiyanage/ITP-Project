import React from 'react';
import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
	const criteria = [
		{ label: "At least 6 characters", met: password.length >= 6 },
		{ label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
		{ label: "Contains lowercase letter", met: /[a-z]/.test(password) },
		{ label: "Contains a number", met: /\d/.test(password) },
		{ label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
	];

	return (
		<div className='mt-2 space-y-1'>
			{criteria.map((item) => (
				<div key={item.label} className='flex items-center text-xs'>
					{item.met ? (
						<Check className='size-4 text-green-500 mr-2' />
					) : (
						<X className='size-4 text-gray-500 mr-2' />
					)}
					<span className={item.met ? "text-green-500" : "text-gray-400"}>{item.label}</span>
				</div>
			))}
		</div>
	);
};

const PasswordStrengthMeter = ({ password }) => {
  const calculateStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return '';
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-emerald-500';
      default:
        return 'bg-gray-200';
    }
  };

  const strength = calculateStrength(password);
  const strengthText = getStrengthText(strength);
  const strengthColor = getStrengthColor(strength);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <div className="text-xs text-gray-400">Password Strength</div>
        <div className="text-xs text-gray-400">{strengthText}</div>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strengthColor} transition-all duration-300`}
          style={{ width: `${(strength / 5) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
