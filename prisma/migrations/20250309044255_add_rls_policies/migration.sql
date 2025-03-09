-- This is an empty migration.

-- RLSを有効化
ALTER TABLE "Result" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAllergy" ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
CREATE POLICY result_user_policy ON "Result" 
  FOR ALL
  USING ("userId" = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY user_allergy_policy ON "UserAllergy" 
  FOR ALL
  USING ("userId" = current_setting('app.current_user_id', true)::uuid);
