import React from "react";

let AccountList = ({ accounts }) => {
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const rows = accounts.map((account) => (
    <tr key={account._id}>
      <td>{account._id}</td>
      <td className={account.balance >= 0 ? "text-success" : "text-danger"}>
        {formatter.format(account.balance / 100)}
      </td>
    </tr>
  ));

  return (
    <div style={{ marginTop: "20px" }}>
      <h1>Accounts</h1>
      <table className="table table-striped rounded">
        <thead>
          <tr className="table-secondary">
            <th>Name</th>
            <th className="right">Balance</th>
          </tr>
        </thead>

        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default AccountList;
