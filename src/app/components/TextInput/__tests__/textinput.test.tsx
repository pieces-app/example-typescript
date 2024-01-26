import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTextInput } from '../TextInput';
import '@testing-library/jest-dom';

describe('DataTextInput', () => {
  test('renders input and textarea elements', () => {
    render(<DataTextInput applicationData={null} />);

    const nameInput = screen.getByPlaceholderText('Type the name of your snippet...') as HTMLInputElement;
    const dataTextarea = screen.getByPlaceholderText('Add your code/text content into this box') as HTMLTextAreaElement;

    expect(nameInput).toBeInTheDocument();
    expect(dataTextarea).toBeInTheDocument();
  });

  test('updates the state when input and textarea values change', () => {
    render(<DataTextInput applicationData={null} />);

    const nameInput = screen.getByPlaceholderText('Type the name of your snippet...') as HTMLInputElement;
    const dataTextarea = screen.getByPlaceholderText('Add your code/text content into this box') as HTMLTextAreaElement;

    // Simulate user input and check if the state is updated accordingly
    expect(nameInput.value).toEqual('');
    fireEvent.change(nameInput, { target: { value: 'Snippet name' } });
    expect(nameInput.value).toEqual('Snippet name');

    expect(dataTextarea.value).toEqual('');
    fireEvent.change(dataTextarea, { target: { value: 'Snippet code' } });
    expect(dataTextarea.value).toEqual('Snippet code');
  });
});



