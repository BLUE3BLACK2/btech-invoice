CREATE TABLE IF NOT EXISTS invoices (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  number text NOT NULL UNIQUE,
  logo text NOT NULL DEFAULT '',
  company_name text NOT NULL DEFAULT '',
  bill_to text NOT NULL,
  date date NOT NULL,
  due_date date NOT NULL,
  currency text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]',
  tax_rate double precision NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  terms text NOT NULL DEFAULT '',
  signature text NOT NULL DEFAULT '',
  signatory text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
