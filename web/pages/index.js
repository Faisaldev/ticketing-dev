import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketsList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>{ticketsList}</tbody>
      </table>
    </div>
  );
};

//Next.js call this on server side if . hard refresh, first call etc...
//But in navigating between routes it get called from browser
//context:{req,res}
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
