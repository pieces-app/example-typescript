import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { CreateButton } from '../Button';
import '@testing-library/jest-dom'

describe('CreateButton', () => {
  it('should have "Create Snippet" as button label', () => {
    render(<CreateButton applicationData={null} data={null} name={null} />);
    const buttonElement = screen.getByRole('button', { name: /Create Snippet/i });
    expect(buttonElement).toBeInTheDocument();
  });
});


// lostPixel