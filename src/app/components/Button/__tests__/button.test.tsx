import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateButton } from '../Button';
import '@testing-library/jest-dom'

// Mocking of the createAsset function
jest.mock('../Asset/Asset', () => ({
  createAsset: jest.fn()
}));

// Resets mock function call counts following each test
describe('CreateButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a button labeled "Create Snippet"', () => {
    render(<CreateButton applicationData={null} data={null} name={null} />);
    const buttonElement = screen.getByRole('button', { name: /Create Snippet/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it('should call createAsset when button is clicked with all parameters provided', () => {
    const applicationData = { propApp: 'app' };
    const data = { propData: 'data' };
    const name = 'propName';
    render(<CreateButton applicationData={applicationData} data={data} name={name} />);
    const buttonElement = screen.getByRole('button', { name: /Create Snippet/i });
    fireEvent.click(buttonElement);
    expect(require('../Asset/Asset').createAsset).toHaveBeenCalledWith(applicationData, data, name);
  });

  it('should alert the user when any parameter is missing', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<CreateButton applicationData={null} data={null} name={null} />);
    const buttonElement = screen.getByRole('button', { name: /Create Snippet/i });
    fireEvent.click(buttonElement);
    expect(alertMock).toHaveBeenCalledWith("One or more parameters are empty or null.");
  });
});