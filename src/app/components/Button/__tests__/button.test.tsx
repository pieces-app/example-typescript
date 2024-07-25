import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateButton } from '../Button';
import '@testing-library/jest-dom';

// Resets mock function call counts following each test
describe('CreateButton', () => {

  it('should render a button labeled "Create Snippet"', () => {
    render(<CreateButton applicationData={null} data={null} name={null} />);
    const buttonElement = screen.getByRole('button', { name: /Create Snippet/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should alert the user when any parameter is missing', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<CreateButton applicationData={null} data={null} name={null} />);
    const buttonElement = screen.getByRole('button', { name: /Create Snippet/i });
    fireEvent.click(buttonElement);
    expect(alertMock).toHaveBeenCalledWith("One or more parameters are empty or null.");
    alertMock.mockRestore();
  });
});