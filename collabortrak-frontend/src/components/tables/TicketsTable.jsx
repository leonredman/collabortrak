import React from "react";
import { Table } from "semantic-ui-react";

const TicketsTable = ({ columns, data }) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          {columns.map((col) => (
            <Table.HeaderCell key={col.key}>{col.label}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((row) => (
          <Table.Row key={row.id}>
            {columns.map((col) => (
              <Table.Cell key={col.key}>
                {typeof col.render === "function"
                  ? col.render(row)
                  : row[col.key]}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TicketsTable;
