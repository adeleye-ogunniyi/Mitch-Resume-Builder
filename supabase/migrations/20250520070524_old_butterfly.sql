/*
  # Add increment_visitor_count function

  1. New Functions
    - `increment_visitor_count()`
      - Updates the visitor count in the visitors table
      - Increments the count by 1 for the default visitor record
      - Updates the updated_at timestamp
      - Returns void

  2. Security
    - Function is accessible to authenticated and service_role users
*/

CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  UPDATE visitors
  SET count = count + 1,
      updated_at = NOW()
  WHERE id = '00000000-0000-0000-0000-000000000000';
END;
$function$;

-- Grant execute permission to authenticated users and service role
GRANT EXECUTE ON FUNCTION public.increment_visitor_count() TO authenticated, service_role;