/**
 * @author Paul Richie Gomes
 * @since 05/04/2026
 */

export const GET_PA_MMIS_TRANSACTION_CODE = `
  SELECT pa.mmis_transaction_code 
  FROM pa_pre_auth pa 
  WHERE pa.prov_id=(SELECT id FROM provider WHERE code='ASD-ND')
  AND pa.form_id = :paramPaFormID
`;