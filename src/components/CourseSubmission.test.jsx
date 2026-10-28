import {render,screen,fireEvent,act} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
import CourseSubmission from './CourseSubmission.jsx';
it('shows sent only after the server-confirmed outbox state',async()=>{
  let update;const client={start:vi.fn(),stop:vi.fn(),flush:vi.fn(),submit:vi.fn(async()=> 'submission-1')};
  const factory=({onChange})=>{update=onChange;return client;};
  render(<CourseSubmission lesson={{id:'fundamentals-01',tasks:[{id:'one'}]}} task={{id:'one'}} files={{'Main.java':'class Main {}'}} clientFactory={factory}/>);
  fireEvent.change(screen.getByLabelText('ID ucznia (klasa i numer)'),{target:{value:'QA-1'}});
  await act(async()=>fireEvent.click(screen.getByRole('button',{name:'Oddaj zadanie'})));
  expect(client.submit).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('imię i nazwisko');
  fireEvent.change(screen.getByLabelText('Imię i nazwisko'),{target:{value:'Anna Test'}});
  await act(async()=>fireEvent.click(screen.getByRole('button',{name:'Oddaj zadanie'})));
  expect(screen.getByRole('status')).toHaveTextContent('Zapisano w kolejce');
  expect(screen.queryByText('✓ Wysłano')).not.toBeInTheDocument();
  act(()=>update([{id:'submission-1',status:'broker_accepted'}]));
  expect(screen.getByRole('status')).toHaveTextContent('✓ Wysłano');
  expect(client.submit).toHaveBeenCalledWith(expect.objectContaining({studentId:'QA-1',studentName:'Anna Test',files:{'Main.java':'class Main {}'},assignment:expect.objectContaining({templateId:'java-course-fundamentals-01',index:0})}));
});
